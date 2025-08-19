import { Body, Controller, Post, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Get, Param, Delete, Put } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { postEntity } from './entities/post.entity';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
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
    async findAllPosts(): Promise<Omit<postEntity, 'author'>[]> {
        const posts = await this.postsService.findAllPosts();
        return posts.map(({ author, ...rest }) => rest);
    }

    @Get(':id')
    async findPostById(@Param('id') id: string): Promise<Omit<postEntity, 'author'>> {
        const post = await this.postsService.findPostById(+id);
        const { author, ...rest } = post;
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

}


