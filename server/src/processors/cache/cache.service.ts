import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

type ConifgOptions = { prefix: string; ttl?: number; key: string };

@Injectable()
export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async cacheSet<T = any>(key: string, value: T, ttl?: number) {
    await this.cacheManager.set(key, value, { ttl: ttl });
  }

  async cacheGet<T = any>(key: any) {
    return this.cacheManager.get<T>(key);
  }

  async cacheDel(key: any) {
    return this.cacheManager.del(key);
  }

  private getKey(config: ConifgOptions) {
    return `${config.prefix}:${config.key}`;
  }

  async cacheSetByConfig<T = any>(data: T, config: ConifgOptions) {
    let key = this.getKey(config);
    return this.cacheSet(key, data, config.ttl);
  }

  async cacheGetByConfig<T = any>(config: ConifgOptions) {
    let key = this.getKey(config);
    return this.cacheGet<T>(key);
  }

  async cacheDelByConfig(config: ConifgOptions) {
    let key = this.getKey(config);
    return this.cacheDel(key);
  }
}
