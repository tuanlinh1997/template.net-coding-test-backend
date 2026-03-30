import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                name: configService.get<string>('dbReadNameContent'),
                type: 'mysql',
                host: configService.get<string>('dbReadHostContent'),
                port: configService.get<number>('dbReadPortContent'),
                username: configService.get<string>('dbReadUserContent'),
                password: configService.get<string>('dbReadPassContent'),
                database: configService.get<string>('dbReadDBnameContent'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                autoLoadEntities: true,
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
    ],
})
export class DatabaseModule {}
