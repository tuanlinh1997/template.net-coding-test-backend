import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './swagger.interface';
import { SWAGGER_CONFIG } from './swagger.config';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

/**
 * Creates an OpenAPI document for an application, via swagger.
 * @param app the nestjs application
 * @returns the OpenAPI document
 */
export function createDocument(app: INestApplication, swaggerConfig: SwaggerConfig = SWAGGER_CONFIG): OpenAPIObject {
    const builder = new DocumentBuilder()
        .setTitle(swaggerConfig.title)
        .setDescription(swaggerConfig.description)
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', description: 'Enter JWT token', in: 'header' }, 'JWT-auth')
        // .addApiKey({ type: 'apiKey', in: 'header', name: 'Authorization' }, 'authorization')
        // .addApiKey({ type: 'apiKey', in: 'header', name: 'macaddress' }, 'macaddress')
        .setVersion(swaggerConfig.version);
    for (const tag of swaggerConfig.tags) {
        builder.addTag(tag);
    }
    const options = builder.build();

    const http_adapter = app.getHttpAdapter();
    const configService = app.get(ConfigService);
    http_adapter.use(`${configService.get<string>('baseUrl')}/api-docs`, (req: Request, res: Response, next: NextFunction) => {
        function parseAuthHeader(input: string): { name: string; pass: string } {
            const [, encodedPart] = input.split(' ');
            const buff = Buffer.from(encodedPart, 'base64');
            const text = buff.toString('ascii');
            const [name, pass] = text.split(':');
            return { name, pass };
        }

        function unauthorizedResponse(): void {
            if (http_adapter.getType() === 'fastify') {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic');
            } else {
                res.status(401);
                res.set('WWW-Authenticate', 'Basic');
            }
            next();
        }
        if (!req.headers.authorization) {
            return unauthorizedResponse();
        }
        const credentials = parseAuthHeader(req.headers.authorization);
        if (credentials?.name !== configService.get<string>('userSwagger') || credentials?.pass !== configService.get<string>('passSwagger')) {
            return unauthorizedResponse();
        }
        next();
    });

    return SwaggerModule.createDocument(app, options);
}
