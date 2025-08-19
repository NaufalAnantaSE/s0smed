import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { JwtAuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: createUserDto): Promise<Omit<User, 'password'>> {
        return this.authService.register(createUserDto);
    }


    @HttpCode(200)
    @Post('login')
    async login(@Body() loginDto: { email: string; password: string }) {
        return this.authService.login(loginDto);
    }

}
