import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { AuthRegisterDocs, AuthLoginDocs, AuthProfileDocs } from '../common/docs/auth-docs.decorator';
import { ApiController } from '../common/base.controller';

@ApiController('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @AuthRegisterDocs()
    @Post('register')
    async register(@Body() createUserDto: createUserDto): Promise<Omit<User, 'password'>> {
        return this.authService.register(createUserDto);
    }

    @AuthLoginDocs()
    @HttpCode(200)
    @Post('login')
    async login(@Body() loginDto: { email: string; password: string }) {
        return this.authService.login(loginDto);
    }

    @AuthProfileDocs()
    @UseGuards(JwtAuthGuard)
    @Post('me')
    async getProfile(@Req() req) {
        console.log(req.user); // This will have user data
        return req.user;
    }

}
