import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect
} from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer, useObservable, useLocalStore } from 'mobx-react-lite';
import HomeLayout from '@/layouts/HomeLayout';
import MoshiWebView from '@/components/MoshiWebView';
import Block from './Block';
import { Divider } from 'react-native-material-ui';
import NewsList from './NewsList';
import { StoreContext } from '@/store';
import Routes from '@/Routes';
import { ICourse } from '@/models/Course';
import CoursePanelInHome from '@/components/CoursePanelInHome';

interface Props {}

const HomeExplore: FunctionComponent<Props> = observer(() => {
  const store = useContext(StoreContext);

  const state = useLocalStore(() => ({
    loading: false
  }));

  const recommendedCourseList: ICourse[] =
    store.exploreData.recommendedCourseList || [];

  const load = useCallback(async () => {
    state.loading = true;
    try {
      await store.exploreNewsList();
      await store.exploreRecommendedCourseList();
    } catch (err) {}
    state.loading = false;
  }, []);

  useEffect(
    () => {
      load();
    },
    [ store.me ]
  );

  return (
    <View style={styles.container}>
      <HomeLayout
        title={'发现'}
        loading={state.loading}
        onRefresh={load}
      >
        <Block
          leftTitle={'新闻'}
          rightTitle="查看更多"
          body={
            <NewsList
              newses={
                store.exploreData && store.exploreData.newsList ? (
                  store.exploreData.newsList
                ) : (
                  []
                )
              }
              onNewsPress={(news) => {
                Routes.article(news);
              }}
            />
          }
          onRightTitlePress={() => {
            Routes.newsList();
          }}
        />
        <Divider />
        <Block
          leftTitle={'推荐专栏'}
          rightTitle="查看全部"
          body={
            <View>
              {recommendedCourseList
                .filter(
                  (course) => course.courseType === 1 && !course.subscribed
                )
                .slice(0, 5)
                .map((course) => {
                  return <CoursePanelInHome key={course.id} course={course} />;
                })}
            </View>
          }
          onRightTitlePress={() => {
            Routes.courseList('column');
          }}
        />
        <Divider />
        <Block
          leftTitle={'推荐视频'}
          rightTitle="查看全部"
          body={
            <View>
              {recommendedCourseList
                .filter(
                  (course) => course.courseType === 2 && !course.subscribed
                )
                .slice(0, 5)
                .map((course) => {
                  return <CoursePanelInHome key={course.id} course={course} />;
                })}
            </View>
          }
          onRightTitlePress={() => {
            Routes.courseList('video');
          }}
        />
      </HomeLayout>
    </View>
  );
});

export default HomeExplore;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle
});
