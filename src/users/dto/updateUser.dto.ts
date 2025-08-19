import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class UpdateUserDto {
    @IsEmail()
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    @MaxLength(20, { message: 'Name must not exceed 20 characters' })
    name?: string;

    @IsString()
    @IsOptional()
    @MinLength(3, { message: 'Bio must be at least 3 characters long' })
    @MaxLength(100, { message: 'Bio must not exceed 100 characters' })
    bio?: string;

}