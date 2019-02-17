import EventEmitter from 'wolfy87-eventemitter';
import Storage from 'react-native-storage';
import { AsyncStorage, YellowBox } from 'react-native';

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