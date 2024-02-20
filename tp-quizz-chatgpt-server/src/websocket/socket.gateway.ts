import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { QuizzService } from '../quizz/quizz.service';

@WebSocketGateway({
  cors: true,
})
export class SocketGateway {
  @WebSocketServer()
  server: Socket;

  constructor(private quizzService: QuizzService) {}

  @SubscribeMessage('create-room')
  async createRoom(
    @MessageBody()
    data: {
      hostUserId: string | number;
    },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      client.emit('room-created', { ...data });
      client.broadcast.emit('room-created', { ...data });
    } catch (error) {
      console.log(error);
    }
  }

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
    client.emit('quiz-generated', JSON.parse(res));
    client.broadcast.emit('quiz-generated', JSON.parse(res));
  }

  @SubscribeMessage('quiz-loading')
  async quizLoading(@ConnectedSocket() client: Socket) {
    client.emit('quiz-loading');
    client.broadcast.emit('quiz-loading');
  }
}
