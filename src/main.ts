import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from './config/swagger';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import helmetFastify from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import { initRequestMiddleware } from './core/middlewares/initReq.middleware';
import { createDocument } from './core/swagger/swagger';
import { contentParser } from 'fastify-multer';
import { TransformInterceptor } from './core/interceptors/transform.response.interceptor';

const CORS_OPTIONS = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: false,
    exposedHeaders: null,
    allowedHeaders: null,
    maxAge: null,
    preflight: true,
    strictPreflight: true,
};

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: 52428800, trustProxy: true }));

    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(configService.get<string>('baseUrl'));
    app.getHttpAdapter().getInstance().addHook('preHandler', initRequestMiddleware);
    app.useGlobalInterceptors(new TransformInterceptor());
    // the next two lines did the trick
    app.enableCors(CORS_OPTIONS);

    app.register(helmetFastify, {
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'blob:'],
            },
        },
    });

    app.register(fastifyStatic, {
        root: join(__dirname, '..', 'public/static'),
        prefix: `${configService.get<string>('baseUrl')}/static`,
    });

    app.register(contentParser);
    const document = createDocument(app, SWAGGER_CONFIG);

    SwaggerModule.setup(`${configService.get<string>('baseUrl')}/api-docs`, app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    const port = configService.get<number>('port');
    await app.listen(port, '0.0.0.0');

    await app.init();
    console.log(`Application is running on port: ${port}`, configService.get<string>('baseUrl'));
}
bootstrap();
