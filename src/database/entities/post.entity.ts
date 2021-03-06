import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { Like } from "./like.entity";

@Schema()
export class PostClass extends Document {

    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    content: string

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: true })
    user: string

    @Prop()
    likes: Like[]

    @Prop()
    comments: Comment[]
}

export const PostSchema = SchemaFactory.createForClass(PostClass)