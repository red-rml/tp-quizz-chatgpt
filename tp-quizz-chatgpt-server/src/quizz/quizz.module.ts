import { Module } from '@nestjs/common';
import { OpenAIModule } from 'nestjs-openai';
import { QuizzService } from './quizz.service';

@Module({
  imports: [
    OpenAIModule.register({
      apiKey: 'APIKEY',
    }),
  ],
  providers: [QuizzService],
})
export class QuizzModule {}
