import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { createUserDto } from './dto/createUser.dto';
import { ImagekitService } from 'src/imagekit/imagekit.provider';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly imagekitService: ImagekitService) { }

    async findOne(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        return user;

    }

    async findById(id: number): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        const { password, ...result } = user;
        return result;
    }

    async createUser(createUserDto: createUserDto): Promise<User> {
        const existUser = await this.findOne(createUserDto.email);
        if (existUser) {
            throw new ConflictException('User already exists');
        }
        return await this.userRepository.save(createUserDto);
    }

    async updateUser(id: number, updateUserDto: Partial<User>): Promise<Omit<User, 'password'>> {
        await this.userRepository.update(id, updateUserDto);
        return this.findById(id);
    }

    async updateProfilePicture(userId: string, file: Express.Multer.File) {
        const uploadResponse = await this.imagekitService.uploadFile(
            file.buffer,
            `user-${userId}-${Date.now()}`
        );
        await this.userRepository.update(userId, { avatar_url: uploadResponse.url });
        return {
            message: 'Profile updated',
            url: uploadResponse.url,
        };
    }
}
