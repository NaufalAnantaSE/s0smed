import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { postEntity } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(postEntity)
        private readonly postsRepository: Repository<postEntity>,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async createComment(postId: number, createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
        const post = await this.postsRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        

        const comment = this.commentsRepository.create({
            content: createCommentDto.content,
            postId,
            userId,
            user,
            post,
        });

        return await this.commentsRepository.save(comment);
    }

    async getPostComments(postId: number): Promise<{ comments: Comment[], count: number }> {
        
        const post = await this.postsRepository.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }
        const comments = await this.commentsRepository.find({
            where: { postId },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });
        const filteredComments = comments.map(comment => ({
            ...comment,
            user: {
                id: comment.user.id,
                name: comment.user.name,
                email: comment.user.email,
                avatar_url: comment.user.avatar_url,
            }
        }));

        return {
            comments: filteredComments as Comment[],
            count: comments.length
        };
    }

    async updateComment(commentId: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<Comment> {
        const comment = await this.commentsRepository.findOne({ 
            where: { id: commentId },
            relations: ['user']
        });
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }
        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only edit your own comments');
        }

        const updatedComment = await this.commentsRepository.save({
            ...comment,
            ...updateCommentDto,
            updatedAt: new Date(),
        });

        return updatedComment;
    }

    async deleteComment(commentId: number, userId: number): Promise<{ message: string }> {
        const comment = await this.commentsRepository.findOne({ 
            where: { id: commentId }
        });
        if (!comment) {
            throw new NotFoundException(`Comment with ID ${commentId} not found`);
        }
        if (comment.userId !== userId) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.commentsRepository.remove(comment);
        return { message: 'Comment deleted successfully' };
    }
}
