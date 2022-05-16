import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { strict } from "assert";
import mongoose, { Document } from "mongoose";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";


@Schema()
export class User extends Document {

    @Prop({ required: true, unique: true })
    username: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop()
    password: string

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    follows: string[]


    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostClass' }] })
    posts: string[]


}

export const UserSchema = SchemaFactory.createForClass(User)