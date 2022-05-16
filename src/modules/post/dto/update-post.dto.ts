import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdatePostDto {

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly title: string

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    readonly content: string
}