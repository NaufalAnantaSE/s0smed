import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { postEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { plainToInstance } from 'class-transformer';
import { ImagekitService } from 'src/imagekit/imagekit.provider';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(postEntity) private readonly postsRepository: Repository<postEntity>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Like) private readonly likesRepository: Repository<Like>,
        @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
        private readonly imagekitService: ImagekitService,
    ) { }

    async createPost(createPostDto: CreatePostDto, userId: number, file?: Express.Multer.File): Promise<postEntity> {
        const author = await this.userRepository.findOne({ where: { id: userId } });
        if (!author) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        let imageUrl: string | undefined;

        
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

    async updatePost(id: number, updatePostDto: UpdatePostDto, userId: number, file?: Express.Multer.File): Promise<postEntity> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        
        if (post.authorId !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        let imageUrl = post.photo_content;

        
        if (file) {
            const uploadResponse = await this.imagekitService.uploadFile(
                file.buffer,
                `post-${userId}-${Date.now()}`
            );
            imageUrl = uploadResponse.url;
        }

        
        const updatedPost = await this.postsRepository.save({
            ...post,
            ...updatePostDto,
            photo_content: imageUrl,
            updatedAt: new Date(), 
        });

        return plainToInstance(postEntity, updatedPost);
    }

    async findAllPosts(): Promise<(postEntity & { likeCount: number; commentCount: number })[]> {
        const posts = await this.postsRepository.find({
            relations: ['likes', 'comments']
        });
        
        return posts.map(post => ({
            ...plainToInstance(postEntity, post),
            likeCount: post.likes ? post.likes.length : 0,
            commentCount: post.comments ? post.comments.length : 0
        }));
    }

    async findPostById(id: number): Promise<postEntity & { likeCount: number; commentCount: number }> {
        const post = await this.postsRepository.findOne({ 
            where: { id },
            relations: ['likes', 'comments']
        });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        
        return {
            ...plainToInstance(postEntity, post),
            likeCount: post.likes ? post.likes.length : 0,
            commentCount: post.comments ? post.comments.length : 0
        };
    }

    async deletePost(id: number, userId?: number): Promise<{ message: string }> {
        const post = await this.postsRepository.findOne({ where: { id } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }
        if (userId && post.authorId !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        await this.postsRepository.softRemove(post);
        return { message: 'Post deleted successfully' };
    }

}
