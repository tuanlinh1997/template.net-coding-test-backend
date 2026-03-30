declare module 'fastify' {
    interface FastifyRequest {
        user: (JWTTypes.SignPayloadType | WhateverOtherTypeYouWant) & { groupLevel: number };
        ip: string;
    }
}
