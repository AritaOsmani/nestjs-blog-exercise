import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [MongooseModule.forRoot("mongodb://arita:arita123@localhost:27017/Blog"), UserModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
