import { IsEmail, IsOptional, IsString, MaxLength, MinLength, Matches } from "class-validator"

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(10)
    readonly username: string

    @IsOptional()
    @IsString()
    @IsEmail()
    readonly email: string

    @IsOptional()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, { message: 'Password is weak!' })
    password: string
}