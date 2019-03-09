import io from 'socket.io-client';
import { GET } from './req';
import { Observable, fromEvent } from 'rxjs';
import EventEmitter from 'wolfy87-eventemitter';

export interface Action {
	type: string;
	payload: string;
}

export interface Remind {
	message: string;
	sendAt: number;
	roomKey: string;
	sender: Sender;
}

export interface Sender {
	id: number;
	nickName: string;
	avatar: string;
}

export class Im {
	private socket?: SocketIOClient.Socket;
	private remindBus: EventEmitter = new EventEmitter();
	readonly defaultRemind$: Observable<Remind> = fromEvent(this.remindBus, 'remind');

	async start() {
		await new Promise(async (resolve, reject) => {
			const resp = await GET('/srv/v1/im');
			const ret = resp.data;
			console.info('ret:', ret);
			const key = ret.key;
			const url = ret.url;
			this.socket = io(url);
			this.socket.on('connect', async () => {
				const ret = await this.emit('verify', { key });
				console.info('verify result:', ret);
				if (ret.state === 'ok') {
					const { roomKeys, roomInfos, lastMsgs, offlineRemindCounts } = ret;
					// TODO
					resolve();
				} else {
					reject(ret.msg);
				}
			});
			this.socket.on('error', (err: any) => {
				console.error('connect error:', err);
			});
			this.socket.on('remind', (msg: Remind) => {
				this.remindBus.emit('remind', msg);
			});
			this.socket.open();
		});
	}

	get remind$(): Observable<Remind> {
		return fromEvent(this.remindBus, 'remind');
	}

	async emit(type: string, payload: any, ackCallback?: (ack: any) => void): Promise<any> {
		return await new Promise((resolve) => {
			this.socket!.emit('im', genAction(type, payload), (ack: any) => {
				resolve(ack);
				ackCallback && ackCallback(ack);
			});
		});
	}

	sendToOne(to: number, message: string) {
		this.emit('sendToOne', { to, message });
	}
}

export function genAction(type: string, payload: any): Action {
	return {
		type,
		payload: JSON.stringify(payload)
	};
} 