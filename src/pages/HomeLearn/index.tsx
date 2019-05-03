import React, { FunctionComponent, useContext, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer, useObservable } from 'mobx-react-lite';
import HomeLayout from '@/layouts/HomeLayout';
import { StoreContext } from '@/store';
import Course, { ICourse } from '@/models/Course';
import CoursesPanel from './CoursesPanel';

interface Props {}

const HomeLearn: FunctionComponent<Props> = observer(() => {
  const store = useContext(StoreContext);

  const state = useObservable({
    loading: false
  });

  useEffect(
    () => {
      (async () => {
        state.loading = true;
        try {
          await store.exploreSubscribedCourseList();
        } catch (err) {}
        state.loading = false;
      })();
    },
    [ store.me ]
  );

  let courses: ICourse[] = [];

  if (store.exploreData && store.exploreData.subscribedCourseList) {
    courses = store.exploreData.subscribedCourseList;
  }

  return (
    <HomeLayout title={'我的学习'} loading={state.loading} onRefresh={store.exploreSubscribedCourseList} >
      <View style={styles.container}>
        <CoursesPanel
          courses={courses.filter((c) => c.courseType === Course.TYPE.COLUMN)}
          courseType={'我的专栏'}
          onViewAll={() => {}}
          containerStyle={{ marginTop: 8 }}
        />
        <CoursesPanel
          courses={courses.filter((c) => c.courseType === Course.TYPE.VIDEO)}
          courseType={'我的课程'}
          onViewAll={() => {}}
          containerStyle={{ marginTop: 8 }}
        />
      </View>
    </HomeLayout>
  );
});

export default HomeLearn;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle
});
