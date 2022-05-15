import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../database/entities/user.entity";
import { UserRepository } from "../../database/repositories/user.repository";
import { JwtPayloadInterface } from "./interfaces/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private userRepository: UserRepository
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret'
        })
    }
    async validate(payload: JwtPayloadInterface): Promise<User> {
        const { email } = payload
        const match = await this.userRepository.getByEmail(email)
        if (!match) {
            throw new UnauthorizedException()
        }
        return match
    }
}