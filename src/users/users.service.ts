import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { createUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) { }

    async   findOne(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        return user;

    }

    async createUser(createUserDto: createUserDto): Promise<User> {
        const existUser = await this.findOne(createUserDto.email);
        if (existUser) {
            throw new ConflictException('User already exists');
        }
        return await this.userRepository.save(createUserDto);
    }


    async findById(id: number): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...result } = user;
        return result;
    }
}
