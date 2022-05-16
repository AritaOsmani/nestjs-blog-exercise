import { ArgumentMetadata, BadRequestException, ConflictException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

@Injectable()
export class CheckIdPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if (!isValidObjectId(value)) {
            throw new BadRequestException(`Invalid id type!`)
        }
        return value
    }
}