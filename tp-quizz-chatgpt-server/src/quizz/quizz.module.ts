import { Module } from '@nestjs/common';
import { OpenAIModule } from 'nestjs-openai';
import { QuizzGateway } from './quizz.gateway';
import { QuizzService } from './quizz.service';

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
