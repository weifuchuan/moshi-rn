import Separator from '@/components/Separator';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/kit';
import HomeLayout from '@/layouts/HomeLayout';
import Routes from '@/Routes';
import { StoreContext } from '@/store';
import ThemeContext from '@/themes';
import { observer, useObservable } from 'mobx-react-lite';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import CoursesPanel from './CoursesPanel';

interface Props {}

const HomeClassroom: FunctionComponent<Props> = () => {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);

  const state = useObservable({
    loading: false
  });

  useEffect(
    () => {
      (async () => {
        state.loading = true;
        try {
          await store.exploreHotCourseList();
        } catch (err) {
          console.error(err);
        }
        state.loading = false;
      })();
    },
    [ store.me ]
  );

  return (
    <View style={styles.container}>
      <HomeLayout
        title={'讲堂'}
        loading={state.loading}
        onRefresh={() => store.exploreHotCourseList()}
      >
        <Separator />
        <CoursesPanel
          courseType={'专栏课程'}
          courses={(store.exploreData && store.exploreData.hotColumnList) || []}
          onViewAll={() => {
            Routes.courseList('column');
          }}
        />
        <Separator />
        <CoursesPanel
          courseType={'视频课程'}
          courses={(store.exploreData && store.exploreData.hotVideoList) || []}
          onViewAll={() => {
            Routes.courseList('video');
          }}
        />
      </HomeLayout>
    </View>
  );
};

export default observer(HomeClassroom);

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle,
  loading: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle
});
