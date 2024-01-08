import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { Socket } from 'socket.io'

// @Catch(WsException, HttpException)
// export class WebsocketExceptionsFilter extends BaseWsExceptionFilter {

//   publicatch(exception: WsException | HttpException, host: ArgumentsHost) {
//     const client = host.switchToWs().getClient() as WebSocket;
//     const data = host.switchToWs().getData();
//     const error = exception instanceof WsException ? exception.getError() : exception.getResponse();
//     const details = error instanceof Object ? { ...error } : { message: error };
//     client.send(JSON.stringify({
//       event: "error",
//       data: {
//         id: (client as any).id,
//         rid: data.rid,
//         ...details
//       }
//     }));
// 	super.catch(exception, host)
//   }
// }

@Catch(WsException, HttpException)
export class WsExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    this.handleError(client, exception);
  }

  public handleError(client: Socket, exception: HttpException | WsException) {
    if (exception instanceof HttpException) {
		client.emit('exception', exception)
	} else {
    	client.emit('exception', exception)
    }
  }
}