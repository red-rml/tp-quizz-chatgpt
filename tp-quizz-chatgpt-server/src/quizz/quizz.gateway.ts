import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { QuizzService as QuizzService } from './quizz.service';

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
    data: { topics: string[]; difficulty: string; isMultiple: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('quizz !!!');

    const res = await this.quizzService.generateQuizz(
      data.topics,
      data.difficulty,
      data.isMultiple,
    );

    console.log(res);
    // client.emit('messages-update', { messages: data.messages, help: '' })
  }
}
