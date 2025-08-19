import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { LikesService } from './likes.service';
import { CommentsService } from './comments.service';
import { PostsController, CommentsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { postEntity } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { ImagekitService } from 'src/imagekit/imagekit.provider';

@Module({
  imports: [TypeOrmModule.forFeature([postEntity, User, Like, Comment])],
  providers: [PostsService, LikesService, CommentsService, ImagekitService],
  controllers: [PostsController, CommentsController]
})
export class PostsModule { }
