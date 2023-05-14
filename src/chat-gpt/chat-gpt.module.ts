import { Module } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { ChatGptController } from './chat-gpt.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ChatGptController],
  providers: [ChatGptService],
  exports: [ChatGptService],
})
export class ChatGptModule {}
