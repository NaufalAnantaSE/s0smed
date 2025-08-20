import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowService } from './follow.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { ImagekitService } from 'src/imagekit/imagekit.provider';


@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  providers: [UsersService, FollowService, ImagekitService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
