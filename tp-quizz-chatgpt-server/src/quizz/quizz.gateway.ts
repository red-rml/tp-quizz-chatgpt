import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { QuizzService } from './quizz.service';

@WebSocketGateway({
  cors: true,
})
export class QuizzGateway {
  @WebSocketServer()
  server: Socket;

  constructor(private quizzService: QuizzService) {}

  @SubscribeMessage('generate-quizz')
  async generateQuizz(
    @MessageBody()
    data: {
      topics: string[];
      difficulty: string;
      isMultiple: boolean;
      numberOfQuestions: number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const res = await this.quizzService.generateQuizz(
      data.topics,
      data.difficulty,
      data.isMultiple,
      data.numberOfQuestions,
    );

    console.log(res);
    client.emit('quizz', res);
    client.broadcast.emit('quizz', res);
  }

  @SubscribeMessage('quiz-loading')
  async quizLoading(@ConnectedSocket() client: Socket) {
    client.emit('quiz-loading');
    client.broadcast.emit('quiz-loading');
  }
}
