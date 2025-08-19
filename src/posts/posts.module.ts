import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { postEntity } from './entities/post.entity';
import { ImagekitService } from 'src/imagekit/imagekit.provider';

@Module({
  imports: [TypeOrmModule.forFeature([postEntity, User])],
  providers: [PostsService, ImagekitService],
  controllers: [PostsController]
})
export class PostsModule { }
