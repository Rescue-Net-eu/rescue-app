import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'missions' })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinMission')
  handleJoin(@MessageBody() missionId: string, @ConnectedSocket() client: any) {
    client.join(missionId);
  }

  @SubscribeMessage('missionMessage')
  handleMessage(
    @MessageBody()
    payload: { missionId: string; message: string; user?: string },
  ) {
    this.server.to(payload.missionId).emit('missionMessage', payload);
  }
}
