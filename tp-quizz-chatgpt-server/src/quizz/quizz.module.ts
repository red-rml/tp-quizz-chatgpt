import { Module } from '@nestjs/common';
import { QuizzService as QuizzService } from './quizz.service';
import { OpenAIModule } from 'nestjs-openai';
import { QuizzGateway } from './quizz.gateway';

@Module({
  imports: [
    OpenAIModule.register({
      apiKey:
        process.env.OPENAI_API_KEY ??
        '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',
    }),
  ],
  providers: [QuizzGateway, QuizzService],
})
export class QuizzModule {}
