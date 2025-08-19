import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { postEntity } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LikesService {
    constructor(
        @InjectRepository(Like)
        private readonly likesRepository: Repository<Like>,
        @InjectRepository(postEntity)
        private readonly postsRepository: Repository<postEntity>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async likePost(postId: number, userId: number): Promise<{ message: string }> {

        const post = await this.postsRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
        const existingLike = await this.likesRepository.findOne({
            where: { postId, userId }
        });

        if (existingLike) {
            throw new ConflictException('You have already liked this post');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // Create like
        const like = this.likesRepository.create({
            postId,
            userId,
            user,
            post,
        });

        await this.likesRepository.save(like);
        return { message: 'Post liked successfully' };
    }

    async unlikePost(postId: number, userId: number): Promise<{ message: string }> {
        const post = await this.postsRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        const existingLike = await this.likesRepository.findOne({
            where: { postId, userId }
        });

        if (!existingLike) {
            throw new NotFoundException('You have not liked this post');
        }

        
        if (existingLike.userId !== userId) {
            throw new ForbiddenException('You can only unlike your own likes');
        }

        await this.likesRepository.remove(existingLike);
        return { message: 'Post unliked successfully' };
    }

    async getPostLikes(postId: number): Promise<{ likes: Like[], count: number }> {
        const post = await this.postsRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        const likes = await this.likesRepository.find({
            where: { postId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });

        return {
            likes: likes.map(like => ({
                ...like,
                user: {
                    id: like.user.id,
                    name: like.user.name,
                    email: like.user.email,
                } as any
            })),
            count: likes.length
        };
    }

    async getLikeCount(postId: number): Promise<number> {
        return await this.likesRepository.count({ where: { postId } });
    }
}
