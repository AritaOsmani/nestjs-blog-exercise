import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(10)
    username: string

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, { message: 'Password is weak!' })
    password: string
}