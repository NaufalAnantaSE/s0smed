import { Body, Controller, Post, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Delete, Put } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { postEntity } from './entities/post.entity';
import { PostsService } from './posts.service';
import { LikesService } from './likes.service';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly likesService: LikesService,
        private readonly commentsService: CommentsService,
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Req() req,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<Omit<postEntity, 'author'>> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        if (!createPostDto.content && !file) {
            throw new BadRequestException('Post must have either content or image');
        }
        
        const userId = req.user.userId;
        const post = await this.postsService.createPost(createPostDto, userId, file);
        
        const { author, ...response } = post;
        return response;
    }

    @Get()
    async findAllPosts() {
        const posts = await this.postsService.findAllPosts();
        return posts.map(({ author, likes, comments, ...rest }) => rest);
    }

    @Get(':id')
    async findPostById(@Param('id') id: string) {
        const post = await this.postsService.findPostById(+id);
        const { author, likes, comments, ...rest } = post;
        return rest;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async updatePost(
        @Param('id') id: string,
        @Body() updatePostDto: UpdatePostDto,
        @Req() req,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<Omit<postEntity, 'author'>> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        const userId = req.user.userId;
        const post = await this.postsService.updatePost(+id, updatePostDto, userId, file);
        
        const { author, ...response } = post;
        return response;
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deletePost(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        // Pass userId untuk validasi ownership di service
        const result = await this.postsService.deletePost(+id, req.user.userId);
        return result
    }

    @Post(':id/like')
    @UseGuards(JwtAuthGuard)
    async likePost(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.likesService.likePost(+id, req.user.userId);
    }

    @Delete(':id/like')
    @UseGuards(JwtAuthGuard)
    async unlikePost(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.likesService.unlikePost(+id, req.user.userId);
    }

    @Get(':id/likes')
    async getPostLikes(@Param('id') id: string) {
        return await this.likesService.getPostLikes(+id);
    }

    // Comment endpoints
    @Post(':id/comments')
    @UseGuards(JwtAuthGuard)
    async addComment(
        @Param('id') id: string,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req
    ) {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.commentsService.createComment(+id, createCommentDto, req.user.userId);
    }

    @Get(':id/comments')
    async getPostComments(@Param('id') id: string) {
        return await this.commentsService.getPostComments(+id);
    }

}

// Comments Controller (separate controller for comment operations)
@Controller('comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
    ) {}

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateComment(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @Req() req
    ) {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.commentsService.updateComment(+id, updateCommentDto, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteComment(@Param('id') id: string, @Req() req) {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.commentsService.deleteComment(+id, req.user.userId);
    }

}


