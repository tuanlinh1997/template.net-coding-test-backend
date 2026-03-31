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
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T> | unknown> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T> | unknown> {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        if (response && response.status) {
            return next.handle().pipe(
                map((data) => {
                    // If the handler returns a non-object (example: plain text),
                    // don't wrap it into the ApiResponse shape.
                    if (data === null || data === undefined) return data;
                    if (typeof data !== 'object') return data;

                    const statusValue: unknown = (data as { status?: unknown })?.status;
                    if (typeof statusValue !== 'number') return data;

                    response.status(statusValue);
                    return {
                        status: (data as { status: number })?.status,
                        result: (data as { result?: number }).result || 0,
                        message: (data as { message?: string }).message || 'Success',
                        data: (data as { data?: unknown }).data,
                        error: (data as { errors?: unknown }).errors || null,
                    };
                }),
            );
        } else {
            return next.handle();
        }
    }
}
