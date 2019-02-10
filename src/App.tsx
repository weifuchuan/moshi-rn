import React, { Component, useReducer, useContext } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox
} from 'react-native-router-flux';
import store, { StoreContext } from './store';
import Login from './pages/Login';
import Reg from './pages/Reg';
import Routes from './Routes';
import ThemeContext, { defaultThemes } from './themes';
import { Provider as AntdRNProvider } from '@ant-design/react-native';
import HomeDrawer from './components/HomeDrawer';
import HomeExplore from './pages/HomeExplore';
import HomeClassroom from './pages/HomeClassroom';
import HomeLearn from './pages/HomeLearn';
import HomeMy from './pages/HomeMy';
import HomeBottomNavigation from './components/HomeBottomNavigation';
import Settings from './pages/Settings';
import { packToClassComponent } from './kit/packToClassComponent';
import Course from './pages/Course';
import CourseList from './pages/CourseList';
const { StackViewStyleInterpolator } = require('react-navigation-stack');

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS === 'android' ? 'moshi://moshi/' : 'moshi://';

export default packToClassComponent(function App() {
  const theme = useContext(ThemeContext);

  return (
    <AntdRNProvider>
      <ThemeContext.Provider value={defaultThemes}>
        <StoreContext.Provider value={store}>
          <Router uriPrefix={prefix} backAndroidHandler={() => {}}>
            <Modal
              key="modal"
              initial
              hideNavBar
              transitionConfig={transitionConfig}
            >
              <Drawer
                key="homeDrawer"
                drawerPosition={'left'}
                contentComponent={HomeDrawer}
                hideDrawerButton={true}
                hideNavBar={true}
                header={() => null}
                drawerWidth={theme.distances.drawerWidth}
              >
                <Tabs
                  key="homeStack"
                  tabBarPosition="bottom"
                  tabBarComponent={HomeBottomNavigation}
                >
                  <Scene
                    initial
                    key="explore"
                    component={HomeExplore}
                    onEnter={() => {
                      bus.emit('selectHomeBottomNav', 'explore');
                    }}
                  />
                  <Scene
                    key="classroom"
                    component={HomeClassroom}
                    onEnter={() => {
                      bus.emit('selectHomeBottomNav', 'classroom');
                    }}
                  />
                  <Scene
                    key="learn"
                    component={HomeLearn}
                    onEnter={() => {
                      bus.emit('selectHomeBottomNav', 'learn');
                    }}
                  />
                  {/* <Scene key="my" component={HomeMy} /> */}
                </Tabs>
              </Drawer>
              <Scene key={'login'} component={Login} />
              <Scene key={'reg'} component={Reg} />
              <Scene key={'settings'} component={Settings} />
              <Scene key="course" component={Course} />
              <Scene key="courseList" component={CourseList} />
            </Modal>
          </Router>
        </StoreContext.Provider>
      </ThemeContext.Provider>
    </AntdRNProvider>
  );
});

const transitionConfig = () => ({
  screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid
});
