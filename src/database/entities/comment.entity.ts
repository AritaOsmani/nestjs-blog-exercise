import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema()
export class Comment extends Document {
    @Prop({ required: true })
    content: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
    post: string

}
export const CommentSchema = SchemaFactory.createForClass(Comment)