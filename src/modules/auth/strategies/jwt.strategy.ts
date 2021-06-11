import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { TokenPayload } from '../auth.service';
import { RedisConfig } from 'src/config/redis.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: RedisConfig.token.secret,
    });
  }

  async validate(payload: TokenPayload) {
    console.log(payload);
    return payload;
  }
}
