import { Provider as AntdRNProvider } from '@ant-design/react-native';
import React, { useContext, Component, useState, useEffect } from 'react';
import { Platform, View, ActivityIndicator } from 'react-native';
import { Drawer, Modal, Router, Scene, Tabs } from 'react-native-router-flux';
import HomeBottomNavigation from './components/HomeBottomNavigation';
import HomeDrawer from './components/HomeDrawer';
import { packToClassComponent } from './kit/packToClassComponent';
import CourseIntro from './pages/CourseIntro';
import CourseList from './pages/CourseList';
import HomeClassroom from './pages/HomeClassroom';
import HomeExplore from './pages/HomeExplore';
import HomeLearn from './pages/HomeLearn';
import Login from './pages/Login';
import Reg from './pages/Reg';
import Settings from './pages/Settings';
import store, { StoreContext } from './store';
import ThemeContext, { defaultThemes } from './themes';
import Subscribe from './pages/Subscribe';
import Pay from './pages/Pay';
import Course from './pages/Course';
import Article from './pages/Article/index';
import ArticleComment from './pages/ArticleComment';
import CreateIssue from './pages/CreateIssue';
import Issue from './pages/Issue';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './kit';
import IssueComment from './pages/IssueComment';
import Help from './pages/Help/index';
import NewsList from './pages/NewsList';
import Communication from './pages/Communication';
const { StackViewStyleInterpolator } = require('react-navigation-stack');

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS === 'android' ? 'moshi://moshi/' : 'moshi://';

export default packToClassComponent(function App() {
  const theme = useContext(ThemeContext);

  return (
    <View style={{ flex: 1 }}>
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
                    key="homeTab"
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
                  </Tabs>
                </Drawer>
                <Scene key={'login'} component={Login} />
                <Scene key={'reg'} component={Reg} />
                <Scene key={'settings'} component={Settings} />
                <Scene key={'help'} component={Help} />
                <Scene key={'course'} component={Course} />
                <Scene key="courseIntro" component={CourseIntro} />
                <Scene key="courseList" component={CourseList} />
                <Scene key={'subscribe'} component={Subscribe} />
                <Scene key={'pay'} component={Pay} />
                <Scene key={'article'} component={Article} />
                <Scene key={'articleComment'} component={ArticleComment} />
                <Scene key={'issue'} component={Issue} />
                <Scene key={'createIssue'} component={CreateIssue} />
                <Scene key={'issueComment'} component={IssueComment} />
                <Scene key={"newsList"} component={NewsList}/>
                <Scene key={'communication'} component={Communication} />
              </Modal>
            </Router>
          </StoreContext.Provider>
        </ThemeContext.Provider>
      </AntdRNProvider>
      <FullLoading />
    </View>
  );
});

const transitionConfig = () => ({
  screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid
});

function FullLoading() {
  const [ loading, setLoading ] = useState(true);
 

  useEffect(() => {
    const f = (loading: boolean) => setLoading(loading);
    bus.addListener('fullLoading', f);
    return () => {
      bus.removeListener('fullLoading', f);
    };
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        top: loading ? 0 : SCREEN_HEIGHT * 100,
        right: 0,
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
      }}
    >
      <ActivityIndicator size="large" color={colors.DoderBlue} />
    </View>
  );
}
