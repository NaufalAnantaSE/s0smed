import { Body, Controller, Get, Param, Post, UseGuards, Request, ForbiddenException, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: createUserDto): Promise<User> {
        return this.usersService.createUser(createUserDto);
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
}