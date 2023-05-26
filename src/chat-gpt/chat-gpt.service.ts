import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from 'openai';
import { GenerateResponseDto } from './dto/generateResponse.dto';

@Injectable()
export class ChatGptService {
  private readonly apiKey: string;
  private readonly apiUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apiKey = process.env.OPEN_AI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';
  }

  async generateResponse(params: GenerateResponseDto): Promise<string> {
    const { prompt } = params;

    const configuration = new Configuration({
      apiKey: this.apiKey,
    });

    const openai = new OpenAIApi(configuration);

    const createChatCompletionConfig: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      n: 1,
      temperature: 1,
      stop: null,
    };

    const completion = await openai.createChatCompletion(
      createChatCompletionConfig,
    );

    const result = completion.data.choices[0].message.content;

    return result;
  }
}
