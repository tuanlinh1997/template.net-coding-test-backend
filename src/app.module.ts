import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { DatabaseModule } from './core/databases/databases.module';
import { LoggerModule } from './core/logger/logger.module';
import { AllExceptionFilter } from './core/filter/exception.filter';
import { ChatModule } from './modules/chat/chat.module';
const Modules = [
    ConfigModule.forRoot({
        isGlobal: true,
        load: [config],
    }),
    DatabaseModule.forRoot(config().connectionsDB),
    LoggerModule,
    ChatModule,
];

@Module({
    imports: Modules,
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter,
        },
    ],
})
export class AppModule {}
