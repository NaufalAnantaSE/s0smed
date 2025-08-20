import { Body, Controller, Get, Param, Post, UseGuards, Request, ForbiddenException, Put, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowService } from './follow.service';
import { createUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUser.dto';
import { GetUsersDocs, GetCurrentUserDocs, GetUserByIdDocs, UpdateUserDocs, DeleteUserDocs, UpdateCurrentUserPhotoDocs, UpdateCurrentUserDocs, DeleteCurrentUserDocs } from '../common/docs/users-docs.decorator';
import { FollowUserDocs, UnfollowUserDocs, GetUserFollowersDocs, GetUserFollowingDocs } from '../common/docs/follow-docs.decorator';
import { ApiController } from '../common/base.controller';

@ApiController('users')
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

    // Get current user profile from JWT token
    @GetCurrentUserDocs()
    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getCurrentUserProfile(@Request() req) {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }
        
        return await this.usersService.findById(req.user.userId);
    }

    // Get user profile (public endpoint - for viewing other users)
    @GetUserByIdDocs()
    @Get('profile/:id')
    async getUserProfile(@Param('id') id: string) {
        return await this.usersService.findById(parseInt(id));
    }

    // Update current user's profile photo (no ID required - uses JWT)
    @UpdateCurrentUserPhotoDocs()
    @Put('me/photo')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar_url'))
    async updateMyProfilePicture(
        @Request() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.usersService.updateProfilePicture(req.user.userId.toString(), file);
    }

    // Update current user's profile (no ID required - uses JWT)
    @UpdateCurrentUserDocs()
    @Put('me')
    @UseGuards(JwtAuthGuard)
    async updateMyProfile(
        @Body() updateUserDto: UpdateUserDto,
        @Request() req
    ) {
        return this.usersService.updateUser(req.user.userId, updateUserDto);
    }

    // Delete current user's account (no ID required - uses JWT)
    @DeleteCurrentUserDocs()
    @Delete('me')
    @UseGuards(JwtAuthGuard)
    async deleteMyAccount(@Request() req) {
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