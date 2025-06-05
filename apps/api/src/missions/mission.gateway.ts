import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'missions' })
export class MissionGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  handleJoin(@MessageBody() missionId: string, @ConnectedSocket() socket: Socket) {
    socket.join(missionId);
    this.server.to(missionId).emit('joined', socket.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { missionId: string; message: string; user: string },
  ) {
    this.server.to(data.missionId).emit('message', {
      user: data.user,
      message: data.message,
    });
  }
}
