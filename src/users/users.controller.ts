import { Body, Controller, Get, Param, Post, UseGuards, Request, ForbiddenException, Put, UseInterceptors, UploadedFile, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { FollowService } from './follow.service';
import { createUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly followService: FollowService,
    ) { }

    @Post()
    async create(@Body() createUserDto: createUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
    }

    // Get user profile (public endpoint)
    @Get('profile/:id')
    async getUserProfile(@Param('id') id: string) {
        return await this.usersService.findById(parseInt(id));
    }

    // users.controller.ts
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

    @Put()
    @UseGuards(JwtAuthGuard)
    async update(
        @Body() updateUserDto: UpdateUserDto,
        @Request() req
    ) {
        return this.usersService.updateUser(req.user.userId, updateUserDto);
    }

    // Follow endpoints
    @Post(':id/follow')
    @UseGuards(JwtAuthGuard)
    async followUser(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.followService.followUser(req.user.userId, parseInt(id));
    }

    @Delete(':id/follow')
    @UseGuards(JwtAuthGuard)
    async unfollowUser(@Param('id') id: string, @Request() req): Promise<{ message: string }> {
        if (!req.user || !req.user.userId) {
            throw new Error('User not authenticated or user ID missing');
        }

        return await this.followService.unfollowUser(req.user.userId, parseInt(id));
    }

    @Get(':id/followers')
    async getUserFollowers(@Param('id') id: string) {
        return await this.followService.getUserFollowers(parseInt(id));
    }

    @Get(':id/following')
    async getUserFollowing(@Param('id') id: string) {
        return await this.followService.getUserFollowing(parseInt(id));
    }
}