import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class Like extends Document {
    @Prop(
        { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
    )
    post: string
}

export const LikeSchema = SchemaFactory.createForClass(Like)