import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request } from 'express';
/**
 * - 라우터 역할
 * like router.get,post,update,delete
 */
@Controller('cats')
export class CatsController {
  @Get('list')
  findAll(): string {
    return 'This action gets all cats';
  }

  @Get(':id')
  findOne(@Param('id') id: number): string {
    return 'This action returns one cats';
  }

  @Get('musical')
  findMusical() {
    return 'This actions returns musical CATs';
  }

  @Post()
  @HttpCode(204)
  create(): string {
    return 'This action adds a new cat';
  }
}
