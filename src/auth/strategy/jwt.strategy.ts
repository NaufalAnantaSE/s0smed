import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            algorithms: ['RS256'],
            secretOrKey: config.get<string>('JWT_PUBLIC_KEY')?.replace(/\\n/g, '\n'),
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email };
    }
}
