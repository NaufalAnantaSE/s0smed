import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { LikesService } from './likes.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { postEntity } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { ImagekitService } from 'src/imagekit/imagekit.provider';

@Module({
  imports: [TypeOrmModule.forFeature([postEntity, User, Like])],
  providers: [PostsService, LikesService, ImagekitService],
  controllers: [PostsController]
})
export class PostsModule { }
