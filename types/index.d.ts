import EventEmitter from 'wolfy87-eventemitter';
import { Store } from '@/store';
import Storage from 'react-native-storage';
import { colors as _colors } from '../loadGlobalProps';

declare global {
  declare var bus: EventEmitter;
  declare var store: Store;
  declare var storage: Storage;
  declare var colors: typeof _colors;
}
