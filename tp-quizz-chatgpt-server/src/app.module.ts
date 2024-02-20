import { Module } from '@nestjs/common';
import { SocketModule } from './websocket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
