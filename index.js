/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import EventEmitter from 'wolfy87-eventemitter';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

global.bus = new EventEmitter();
global.storage = new Storage({
  size: 100000000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: false
});

AppRegistry.registerComponent(appName, () => App);
