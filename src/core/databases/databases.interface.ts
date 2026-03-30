import { DataSourceOptions } from 'typeorm';

/**
 * Contains configuration options for the TypeORM database.
 * Note that connection details, such as host and credentials, come from the environment variables, via the main config.
 */
export interface DbConfigEntity {
    entities: DataSourceOptions['entities'];
}

/**
 * Configuration for the database connection.
 */
export declare type ConfigDBData = {
    type: 'mysql' | 'mariadb' | 'postgres' | 'mongodb';
    /**
     * The driver object
     * This defaults to require("mysql").
     * Falls back to require("mysql2")
     */
    driver?: string;
    url?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    name?: string;
};

export declare type Connections = {
    db_template_net?: ConfigDBData;
};
