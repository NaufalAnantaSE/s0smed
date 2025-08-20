import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { createUserDto } from './dto/createUser.dto';
import { ImagekitService } from 'src/imagekit/imagekit.provider';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Follow) private readonly followRepository: Repository<Follow>,
        private readonly imagekitService: ImagekitService
    ) {}

    async findOne(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        return user;
    }

    async findOneWithPassword(email: string): Promise<User | null> {
        const user = await this.userRepository.findOne({ 
            where: { email },
            select: ['id', 'email', 'name', 'password', 'bio', 'avatar_url', 'createdAt', 'updatedAt', 'deletedAt']
        });
        if (!user) {
            return null;
        }
        return user;
    }

    async findAll(): Promise<any[]> {
        const users = await this.userRepository.find({
            relations: ['followers', 'following']
        });
        
        return users.map(user => {
            const { password, followers, following, ...result } = user;
            return {
                ...result,
                followers_count: followers ? followers.length : 0,
                following_count: following ? following.length : 0
            };
        });
    }

    async findById(id: number): Promise<any> {
        const user = await this.userRepository.findOne({ 
            where: { id },
            relations: ['followers', 'following']
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        
        const { password, followers, following, ...result } = user;
        return {
            ...result,
            followerCount: followers ? followers.length : 0,
            followingCount: following ? following.length : 0
        };
    }

    async createUser(createUserDto: createUserDto): Promise<User> {
        const existUser = await this.findOne(createUserDto.email);
        if (existUser) {
            throw new ConflictException('User already exists');
        }
        return await this.userRepository.save(createUserDto);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.email) {
            const existingUser = await this.findOne(updateUserDto.email);
            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email already in use');
            }
        }
        const updatedUser = this.userRepository.merge(user, updateUserDto);
        await this.userRepository.save(updatedUser);
        
        return this.findById(id);
    }


    async updateProfilePicture(userId: string, file: Express.Multer.File) {
        const uploadResponse = await this.imagekitService.uploadFile(
            file.buffer,
            `user-${userId}-${Date.now()}`
        );

        const user = await this.userRepository.findOne({ where: { id: parseInt(userId) } });
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        
        user.avatar_url = uploadResponse.url;
        await this.userRepository.save(user);
        
        return {
            message: 'Profile updated',
            url: uploadResponse.url,
        };
    }

    async deleteUser(id: number): Promise<{ message: string }> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await this.userRepository.remove(user);
        return { message: 'User deleted successfully' };
    }
}
