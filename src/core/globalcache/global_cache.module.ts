import { Global, Module } from '@nestjs/common';
import { GlobalCacheService } from './global_cache.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    providers: [GlobalCacheService],
    exports: [GlobalCacheService],
})
export class GlobalCacheModule {}
