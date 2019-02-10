import React, { FunctionComponent, useContext } from 'react';
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
import CoursesPanel from '@/components/CoursesPanel';
import { ICourse } from '@/models/Course';
import ThemeContext from '@/themes';
import replaceArray from '@/kit/functions/replaceArray';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '@/kit';

interface Props {}

const HomeClassroom: FunctionComponent<Props> = () => {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);
  const hotColumnList = useObservable<ICourse[]>([]);
  const hotVideoList = useObservable<ICourse[]>([]);
  if (store.exploreData) {
    replaceArray(hotColumnList, store.exploreData.hotColumnList);
    replaceArray(hotVideoList, store.exploreData.hotVideoList);
  }

  return (
    <View style={styles.container}>
      <HomeLayout title={'讲堂'}>
        <Separator />
        <CoursesPanel
          courseType={'专栏课程'}
          courses={hotColumnList.slice()}
          onViewAll={() => {}}
        />
        <Separator />
        <CoursesPanel
          courseType={'视频课程'}
          courses={hotVideoList.slice()}
          onViewAll={() => {}}
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
    justifyContent:"center",
    alignItems:"center"
  } as ViewStyle
});
