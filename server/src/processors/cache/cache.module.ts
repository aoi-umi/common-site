import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { env } from '../config/config.service';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ...env.redis,
    }),
  ],
  controllers: [],
  providers: [CacheService],
  exports: [CacheService],
})
export class AppCacheModule {}
