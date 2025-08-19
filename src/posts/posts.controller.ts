import { Body, Controller, Post, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
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

}


