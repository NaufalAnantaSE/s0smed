import { Body, Controller, Get, Param, Post, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/guards/auth.guard';

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

}
