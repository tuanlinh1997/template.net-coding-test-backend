import { DynamicModule, Module, BadRequestException } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Connections, ConfigDBData } from './databases.interface';
import { ErrorResponse } from './../helpers/responses/error.response';
import { responseMsg } from '../constants/responseMsg.const';

@Module({})
export class DatabaseModule {
    private static getConnectionOptions(configDBData: ConfigDBData): TypeOrmModuleOptions {
        let connectionOptions = null;
        if (!configDBData.type) {
            throw new BadRequestException(new ErrorResponse(responseMsg.CONFIG_DB_INVALID.MESSAGE, responseMsg.CONFIG_DB_INVALID.CODE));
        }
        console.log('configDBData.type: ', configDBData.type);
        switch (configDBData.type) {
            case 'mysql':
                connectionOptions = DatabaseModule.getConnectionOptionsMysql(configDBData);
                break;
            case 'postgres':
                connectionOptions = DatabaseModule.getConnectionOptionsPostgres(configDBData);
                break;
            case 'mongodb':
                connectionOptions = DatabaseModule.getConnectionOptionsMongo(configDBData);
            default:
                connectionOptions = DatabaseModule.getConnectionOptionsMysql(configDBData);
                break;
        }
        const dataConnection = {
            ...connectionOptions,
            synchronize: true,
            logging: false,
        };
        console.log('dataConnection: ', dataConnection);
        return dataConnection;
    }

    private static getConnectionOptionsPostgres(configDBData: ConfigDBData): TypeOrmModuleOptions {
        return {
            name: configDBData.name,
            type: configDBData.type,
            url: configDBData.url,
            keepConnectionAlive: true,
            ssl: false,
            // process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
            // ? { rejectUnauthorized: false }
            // : false,
        };
    }

    private static getConnectionOptionsMysql(configDBData: ConfigDBData): TypeOrmModuleOptions {
        return {
            name: configDBData.name,
            type: configDBData.type,
            host: configDBData.host,
            port: configDBData.port,
            username: configDBData.username,
            password: configDBData.password,
            database: configDBData.database,
            keepConnectionAlive: true,
            ssl: false,
            autoLoadEntities: true,
            maxQueryExecutionTime: 5000,
            connectTimeout: 10000,
            extra: {
                connectionLimit: 10,
            },
            synchronize: true,
        };
    }

    private static getConnectionOptionsMongo(configDBData: ConfigDBData): TypeOrmModuleOptions {
        return {
            type: configDBData.type,
            host: configDBData.host,
            port: configDBData.port,
            username: configDBData.username,
            password: encodeURIComponent(configDBData.password),
            database: configDBData.database,
            authSource: process.env.DATABASE_DATA_SOURCE,
            synchronize: true,
            logging: false,
            autoLoadEntities: true,
            extra: {
                maxPoolSize: 10,
            },
        };
    }

    public static forRoot(connections: Connections): DynamicModule {
        const DbConfigModules = [];
        for (const [key, value] of Object.entries(connections)) {
            console.log('key: ', key);
            const DbConfigModule = TypeOrmModule.forRoot(DatabaseModule.getConnectionOptions(value));
            DbConfigModules.push(DbConfigModule);
        }
        return {
            module: DatabaseModule,
            imports: DbConfigModules,
        };
    }
}
