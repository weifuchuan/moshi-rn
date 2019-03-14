import EventEmitter from 'wolfy87-eventemitter';
import Storage from 'react-native-storage';
import { YellowBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { colors } from './src/themes/index';

YellowBox.ignoreWarnings([]);

// @ts-ignore
global.bus = new EventEmitter();
// @ts-ignore
global.storage = new Storage({
  size: 100000000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: false
});

(global as any).colors = colors;

console.warn(colors); 