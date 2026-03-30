import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.custom';

@Global()
@Module({
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
