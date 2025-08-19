import { IsEmail, IsNotEmpty } from "class-validator";

    
export class loginDto{
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;
}