import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { createUserDto } from 'src/users/dto/createUser.dto';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }


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
