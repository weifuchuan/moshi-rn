import React, { FunctionComponent, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  ActivityIndicator
} from 'react-native';
import { observer, useObservable } from 'mobx-react-lite';
import HomeLayout from '@/layouts/HomeLayout';
import { StoreContext } from '@/store';
import Separator from '@/components/Separator';
import CoursesPanel from './CoursesPanel';
import { ICourse } from '@/models/Course';
import ThemeContext from '@/themes';
import replaceArray from '@/kit/functions/replaceArray';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/kit';
import Routes from '@/Routes';
import { runInAction, autorun } from 'mobx';

interface Props {}

const HomeClassroom: FunctionComponent<Props> = () => {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <HomeLayout title={'讲堂'}>
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
      {store.explored ? null : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={theme.colors.LOADING_BLUE} />
        </View>
      )}
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
