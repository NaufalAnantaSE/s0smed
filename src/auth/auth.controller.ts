import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.entity';
import { createUserDto } from 'src/users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
    constructor (private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: createUserDto): Promise<Omit<User, 'password'>> {
        return this.authService.register(createUserDto);
    }
}
