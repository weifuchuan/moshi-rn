import { StatusBar , StatusBarStyle } from 'react-native';

const barStyleStack: [StatusBarStyle, boolean][] = [ [ 'dark-content', true ] ];
const backgroundColorStack: [string, boolean][] = [ [ '#EAEAEF', true ] ];

const StatusBarPack = {
	pushBarStyle(style: StatusBarStyle, animated: boolean = true) {
		StatusBar.setBarStyle(style, animated);
		barStyleStack.push([ style, animated ]);
	},
	popBarStyle() {
		if (barStyleStack.length === 1) {
			barStyleStack.push([ 'dark-content', true ]);
		}
		barStyleStack.pop();
		const [ style, animated ] = barStyleStack[barStyleStack.length - 1];
		StatusBar.setBarStyle(style, animated);
	},
	pushBackgroundColor(color: string, animated: boolean = true) {
		StatusBar.setBackgroundColor(color, animated);
		backgroundColorStack.push([ color, animated ]);
	},
	popBackgroundColor() {
		if (backgroundColorStack.length === 1) {
			backgroundColorStack.push([ '#EAEAEF', true ]);
		}
		backgroundColorStack.pop();
		const [ color, animated ] = backgroundColorStack[backgroundColorStack.length - 1];
		StatusBar.setBackgroundColor(color, animated);
	},
	StatusBar
};

export default StatusBarPack;
