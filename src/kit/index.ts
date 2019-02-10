import { Dimensions, NativeModules } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export function measure(
	e: any
): Promise<{
	x: number;
	y: number;
	width: number;
	height: number;
	pageX: number;
	pageY: number;
}> {
	return new Promise((resolve) => {
		NativeModules.UIManager.measure(
			e.target,
			(x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
				resolve({ x, y, width, height, pageX, pageY });
			}
		);
	});
} 

export async function retryDo<Result>(action: () => Promise<Result>, retryCount: number): Promise<Result> {
	if (retryCount > 1) {
		try {
			return await action();
		} catch (err) {
			return await retryDo(action, retryCount - 1);
		}
	} else {
		try {
			return await action();
		} catch (err) {
			throw err;
		}
	}
}

// repeat run f by 100ms if f return false
export function repeat(f: () => boolean, timeout: number = 100) {
	const g: any = (g: any) => {
		if (f()) {
			return;
		}
		setTimeout(() => {
			g(g);
		}, timeout);
	};
	g(g); 
}
 