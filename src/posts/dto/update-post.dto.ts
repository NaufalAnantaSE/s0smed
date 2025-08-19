import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'Title must not exceed 100 characters' })
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Content must not exceed 500 characters' })
    content?: string;
}
