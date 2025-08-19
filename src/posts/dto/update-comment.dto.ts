import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCommentDto {
    @IsOptional()
    @IsString()
    @MaxLength(500, { message: 'Comment must not exceed 500 characters' })
    content?: string;
}
