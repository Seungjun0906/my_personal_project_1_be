import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `${__dirname}/configs/env/.${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      migrations: ['migrations/*{.ts,.js'],
    }),
    ChatGptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
