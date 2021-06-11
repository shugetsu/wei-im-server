import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserRole } from 'src/enums/user-role.enum';
import { Roles } from 'src/providers/decorators/roles-decorator';

@WebSocketGateway()
export class ImGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const { token } = client.handshake.query;
    if (!token) {
    }
    console.log('有人连接了');
  }

  async handleDisconnect(client: Socket) {
    console.log('断开连接');
  }

  @Roles(UserRole.NORMAL_USER)
  @SubscribeMessage('test')
  async test(@MessageBody() message) {
    console.log(message);
  }
}
