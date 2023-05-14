import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { GenerateResponseDto } from './dto/generateResponse.dto';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(private readonly chatGptService: ChatGptService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  generateResponse(@Body() generateResponseDto: GenerateResponseDto) {
    return this.chatGptService.generateResponse(generateResponseDto);
  }
}
