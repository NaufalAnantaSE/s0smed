import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async validateUser(loginDto: { email: string; password: string }) {
        // TODO: implementasi cek user di database
        const user = { id: 1, email: loginDto.email }; // dummy
        if (!user) throw new UnauthorizedException();
        return user;
    }

    async login(loginDto: { email: string; password: string }) {
        const user = await this.validateUser(loginDto);

        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(createUserDto: createUserDto): Promise<Omit<User, 'password'>> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const createdUser = await this.usersService.createUser({
            ...createUserDto,
            password: hashedPassword
        });
        const { password, ...result } = createdUser;
        return result;
    }
}
