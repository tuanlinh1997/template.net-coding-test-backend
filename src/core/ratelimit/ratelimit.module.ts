import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                throttlers: [
                    {
                        ttl: configService.get<number>('rateLimit'),
                        limit: configService.get<number>('maxRequestAll'),
                    },
                ],
            }),
        }),
    ],
})
export class RateLimitModule {}
