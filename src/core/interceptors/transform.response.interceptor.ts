import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    status: number;
    result: number;
    message: string;
    data: T;
    error: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        if (response && response.status) {
            return next.handle().pipe(
                map((data) => {
                    response.status(data?.status);
                    if (response) {
                        return {
                            status: data?.status,
                            result: data.result || 0,
                            message: data.message || 'Success',
                            data: data.data,
                            error: data.errors || null,
                        };
                    }
                }),
            );
        } else {
            return next.handle();
        }
    }
}
