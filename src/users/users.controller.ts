import { Body, Controller, Get, Param, Post, UseGuards, Request, ForbiddenException, Put, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowService } from './follow.service';
import { createUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetUsersDocs, GetUserByIdDocs, UpdateUserDocs, DeleteUserDocs } from '../common/docs/users-docs.decorator';
import { FollowUserDocs, UnfollowUserDocs, GetUserFollowersDocs, GetUserFollowingDocs } from '../common/docs/follow-docs.decorator';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly followService: FollowService,
    ) { }

    @GetUsersDocs()
    @Get()
    @UseGuards(JwtAuthGuard)
    async getAllUsers() {
        return await this.usersService.findAll();
    }

    // Get user profile (public endpoint)
    @GetUserByIdDocs()
    @Get('profile/:id')
    async getUserProfile(@Param('id') id: string) {
        return await this.usersService.findById(parseInt(id));
    }

    // users.controller.ts
    @GetUserByIdDocs()
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async getUserById(
        @Param('id') id: string,
        @Request() req
    ) {
        // Cek apakah id dari params sama dengan id dari token
        if (req.user.userId !== parseInt(id)) {
            throw new ForbiddenException('You can only access your own data');
        }

        return this.usersService.findById(parseInt(id));
    }

    @UpdateUserDocs()
    @Put('photo/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar_url'))
    async updateProfilePicture(
        @Param('id') id: string,
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (req.user.userId !== parseInt(id)) {
            throw new ForbiddenException('You can only access your own data');
        }

        return this.usersService.updateProfilePicture(id, file);
    }

    @UpdateUserDocs()
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req
    ) {
        if (req.user.userId !== parseInt(id)) {
            throw new ForbiddenException('You can only update your own profile');
        }
        return this.usersService.updateUser(req.user.userId, updateUserDto);
    }

    @DeleteUserDocs()
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteUser(
        @Param('id') id: string,
        @Request() req
    ) {
        if (req.user.userId !== parseInt(id)) {
            throw new ForbiddenException('You can only delete your own account');
        }
        return this.usersService.deleteUser(req.user.userId);
    }

    // Follow endpoints
    @FollowUserDocs()
    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    async followUser(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.followService.followUser(req.user.userId, parseInt(id));
    }

    @UnfollowUserDocs()
    @Delete(':id/follow')
    @UseGuards(JwtAuthGuard)
    async unfollowUser(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.followService.unfollowUser(req.user.userId, parseInt(id));
    }

    @GetUserFollowersDocs()
    @Get(':id/followers')
    async getUserFollowers(@Param('id') id: string) {
        return await this.followService.getUserFollowers(parseInt(id));
    }

    @GetUserFollowingDocs()
    @Get(':id/following')
    async getUserFollowing(@Param('id') id: string) {
        return await this.followService.getUserFollowing(parseInt(id));
    }
}