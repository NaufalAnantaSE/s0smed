import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ImagekitService } from 'src/imagekit/imagekit.provider';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, ImagekitService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
