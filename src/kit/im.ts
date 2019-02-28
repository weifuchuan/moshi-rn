import io from 'socket.io-client';
import { GET } from '@/kit/req';

export interface Action {
  type: string;
  payload: string;
}

export class ImFlow {
  private socket?: SocketIOClient.Socket;

  async start() {
    await new Promise(async (resolve, reject) => {
      const resp = await GET('/srv/v1/im');
      const ret = resp.data;
      const key = ret.key;
      const url = ret.url;
      this.socket = io(url);
      this.socket.on('connect', async () => {
        const ret = await this.emit('verify', { key });
        console.info('verify result:', ret);
        if (ret.state === 'ok') {
          const { roomKeys, roomInfos, lastMsgs } = ret;
          // TODO
          resolve();
        } else {
          reject(ret.msg);
        }
      });
      this.socket.on('error', (err: any) => {
        console.error('connect error:', err);
      });
    });
  }

  async emit(
    type: string,
    payload: any,
    ackCallback?: (ack: any) => void
  ): Promise<any> {
    return await new Promise((resolve) => {
      this.socket!.emit('im', genAction(type, payload), (ack: any) => {
        resolve(ack);
        ackCallback && ackCallback(ack);
      });
    });
  }
}

export function genAction(type: string, payload: any): Action {
  return {
    type,
    payload: JSON.stringify(payload)
  };
}

if (__DEV__) {
  (window as any).ImFlow = ImFlow;
}
