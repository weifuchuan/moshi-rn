import EventEmitter from 'wolfy87-eventemitter';
import { Store } from '@/store';
import Storage from 'react-native-storage';

declare global {
  declare var bus: EventEmitter;
  declare var store: Store;
  declare var storage: Storage;
}
