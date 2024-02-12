import { Module } from '@nestjs/common';
import { OpenAIModule } from 'nestjs-openai';
import { QuizzGateway } from './quizz.gateway';
import { QuizzService } from './quizz.service';

@Module({
  imports: [
    OpenAIModule.register({
      apiKey: process.env.OPENAI_API_KEY ?? 'API KEY',
    }),
  ],
  providers: [QuizzGateway, QuizzService],
})
export class QuizzModule {}
