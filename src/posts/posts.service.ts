import { Injectable, NotFoundException } from '@nestjs/common';
import { postEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ImagekitService } from 'src/imagekit/imagekit.provider';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(postEntity) private readonly postsRepository: Repository<postEntity>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly imagekitService: ImagekitService,
    ) { }

    async createPost(createPostDto: CreatePostDto, userId: number, file?: Express.Multer.File): Promise<postEntity> {
        const author = await this.userRepository.findOne({ where: { id: userId } });
        if (!author) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        let imageUrl: string | undefined;

        // Upload image
        if (file) {
            const uploadResponse = await this.imagekitService.uploadFile(
                file.buffer,
                `post-${userId}-${Date.now()}`
            );
            imageUrl = uploadResponse.url;
        }

        const newPost = this.postsRepository.create({
            title: createPostDto.title,
            content: createPostDto.content,
            photo_content: imageUrl,
            author: author,
        });

        const savedPost = await this.postsRepository.save(newPost);
        return plainToInstance(postEntity, savedPost);
    }

}
