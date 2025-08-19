import { IsEmail, IsString, MinLength } from "class-validator";

export class createUserDto {

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}