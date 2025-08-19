import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100, { message: 'Title must not exceed 100 characters' })
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Content must not exceed 500 characters' })
    @ValidateIf((o) => !o.hasImage || o.content)
    content?: string;

    @IsOptional()
    hasImage?: boolean;
}
