import { Module } from '@nestjs/common';
import { OpenAIModule } from 'nestjs-openai';
import { QuizzModule } from 'src/quizz/quizz.module';
import { QuizzService } from 'src/quizz/quizz.service';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    OpenAIModule.register({
      apiKey: 'APIKEY',
    }),
    QuizzModule,
  ],
  providers: [SocketGateway, QuizzService],
})
export class SocketModule {}
