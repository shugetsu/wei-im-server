import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { RedisConfig } from 'src/config/redis.config';
import { Device } from 'src/enums/device.enum';

export interface TokenPayload {
  userId: string;
  device: Device;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * 令牌生成
   * @param payload
   */
  generateToken(payload: TokenPayload) {
    return this.jwtService.sign(payload);
  }

  /**
   * 保存令牌到缓存
   * @param payload
   * @param token
   */
  async saveTokenToCache(payload: TokenPayload, token: string) {
    const cacheKey = this.formatTokenCacheKey(payload);
    const ttl = this.getTokenCacheTTL(payload.device);
    const result = await this.cacheManager.set(cacheKey, token, { ttl });
    return result === 'OK';
  }

  /**
   * 格式化缓存令牌的 Key
   * @param payload
   */
  formatTokenCacheKey(payload: TokenPayload) {
    return `${payload.userId}#${payload.device}`;
  }

  /**
   * 根据 key 获取缓存的令牌
   * @param key
   */
  async getCacheTokenByKey(key: string) {
    return await this.cacheManager.get(key);
  }

  /**
   * 解密令牌
   * @param token
   */
  decodeToken(token: string): TokenPayload {
    return this.jwtService.verify(token);
  }

  /**
   * 续签令牌
   * @param payload
   * @param token
   */
  async renewalToken(payload: TokenPayload, token: string) {
    const ttl = this.getTokenCacheTTL(payload.device);
    const cacheKey = this.formatTokenCacheKey(payload);
    const result = await this.cacheManager.set(cacheKey, token, { ttl });
    return result === 'OK';
  }

  /**
   * 获取令牌缓存的时间
   * @param device
   */
  getTokenCacheTTL(device: Device) {
    const hour = RedisConfig.token.ttl[device] || 0;
    const ttl = hour * 24 * 60 * 60;
    return ttl;
  }
}
