const Joi = require('joi');
const fs = require('fs');
const dotenv = require('dotenv');

const root = `${process.cwd()}`;

let pathENV = `${root}/.env.local`;
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
    case 'production':
        pathENV = `${root}/.env.production`;
        break;
    case 'staging':
        pathENV = `${root}/.env.staging`;
        break;
    case 'pilot':
        pathENV = `${root}/.env.pilot`;
        break;
    case 'development':
        pathENV = `${root}/.env.dev`;
        break;
}

console.log('pathENV: ', pathENV);

if (fs.existsSync(pathENV)) {
    // get from file env
    dotenv.config({ path: pathENV });
} else {
    console.log('DOES NOT exist:');
    // get env from config map and secret
}
// define validation for all the env vars
const envVarsSchema = Joi.object({
    NODE_ENV: Joi.string().allow('development', 'staging', 'production', 'local', 'pilot').default('development'),
    APP_URL: Joi.string().required(),
    APP_HOST: Joi.string().required(),
    BASE_URL: Joi.string().required(),
    SERVER_TIMEOUT: Joi.number().required(),

    DATABASE_TYPE: Joi.string().required(),
    DATABASE_NAME: Joi.string().required(),
    DATABASE_CONNECTION: Joi.string().required(),
    DATABASE_HOST: Joi.string().required(),
    DATABASE_PORT: Joi.string().required(),
    DATABASE_USERNAME: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    DATABASE_DB_NAME: Joi.string().required(),

    DESTINATION: Joi.string().required(),
    DOMAIN_API: Joi.string().required(),

    OPENAI_API_KEY: Joi.string().required(),
})
    .unknown()
    .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const config = () => ({
    appName: 'API Channel',
    env: envVars.NODE_ENV,
    port: envVars.APP_PORT,
    appWelcome: envVars.APP_WELCOME,
    appUrl: envVars.APP_URL,
    appHost: envVars.APP_HOST,
    baseUrl: envVars.BASE_URL,

    connectionsDB: {
        db_template_net: {
            type: envVars.DATABASE_TYPE,
            driver: envVars.DATABASE_TYPE,
            url: '',
            host: envVars.DATABASE_HOST,
            port: envVars.DATABASE_PORT,
            database: envVars.DATABASE_DB_NAME,
            username: envVars.DATABASE_USERNAME,
            password: envVars.DATABASE_PASSWORD,
            name: envVars.DATABASE_NAME,
        },
    },

    secret: envVars.SECRET,
    destination: envVars.DESTINATION,
    domain_api: envVars.DOMAIN_API,
    userSwagger: envVars.USERNAME_SWAGGER,
    passSwagger: envVars.PASSWORD_SWAGGER,

    openai: {
        apiKey: envVars.OPENAI_API_KEY,
    },
});
