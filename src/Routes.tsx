import { Actions } from 'react-native-router-flux';

const Routes = {
  login() {
    Actions.push('login');
  },
  reg() {
    Actions.push('reg');
  },
  explore() {
    Actions.push('explore');
  },
  classroom() {
    Actions.push('classroom');
  },
  learn() {
    Actions.push('learn');
  },
  // my(){
  //   Actions.push("my")
  // },
  settings() {
    Actions.push('settings');
  },
  course(id: number) {
    Actions.push('course', { id });
  }
};

(Routes as any).__proto__ = Actions;

export default Routes as (typeof Routes) & (typeof Actions);
