import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(500, { message: 'Comment must not exceed 500 characters' })
    content: string;
}
