import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CatsController } from './cats/cats.controller';
import { Telegram } from './telegram/telegram';
import { TelegramModuleModule } from './telegram.module/telegram.module.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TelegramModuleModule,
    TelegramModule,
  ],
  controllers: [AppController, CatsController],
  providers: [AppService, Telegram],
})
export class AppModule {}
