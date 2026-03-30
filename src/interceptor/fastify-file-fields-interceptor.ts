import { CallHandler, ExecutionContext, HttpException, HttpStatus, Inject, mixin, NestInterceptor, Optional, Type } from '@nestjs/common';
import { Observable } from 'rxjs';
import FastifyMulter from 'fastify-multer';
import { Options, Multer, Field } from 'multer';

type MulterInstance = any;

export function FastifyFilesFieldsInterceptor(filesInput: ReadonlyArray<Field>, localOptions: Options): Type<NestInterceptor> {
    class MixinInterceptor implements NestInterceptor {
        protected multer: MulterInstance;

        constructor(
            @Optional()
            @Inject('MULTER_MODULE_OPTIONS')
            options: Multer,
        ) {
            this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
        }

        async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
            const ctx = context.switchToHttp();
            await new Promise<void>((resolve, reject) =>
                this.multer.fields(filesInput)(ctx.getRequest(), ctx.getResponse(), (error: any) => {
                    if (error) {
                        return reject(new HttpException(`${error.message}`, HttpStatus.UNPROCESSABLE_ENTITY));
                    }
                    resolve();
                }),
            );

            return next.handle();
        }
    }
    const Interceptor = mixin(MixinInterceptor);
    return Interceptor as Type<NestInterceptor>;
}
