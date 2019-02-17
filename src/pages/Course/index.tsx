import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useCallback
} from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer, useObservable } from 'mobx-react-lite';
import { ICourse } from '@/models/Course';
import { StoreContext } from '@/store';
import ThemeContext from '@/themes';
import CourseModel from '@/models/Course';
import { toJS, runInAction, action } from 'mobx';
import { Toast, Tabs } from '@ant-design/react-native';
import ArticleList from '@/components/ArticleList';
import Article, { IArticle } from '@/models/Article';
import { Page } from '@/models/Page';
import BackableLayout from '@/layouts/BackableLayout';
import Routes from '@/Routes';

interface Props {
  course: ICourse;
}

const Course: FunctionComponent<
  Props
> = observer(({ course: courseByUpStream }) => {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);

  const state = useObservable({
    course: CourseModel.from(toJS(courseByUpStream)),
    articleList: [] as IArticle[],
    articlePage: null as Page<IArticle> | null,
    cending: 'desc' as 'desc' | 'asc'
  });

  const fetchCourseData = useCallback(async () => {
    try {
      const ret = await CourseModel.fetch(courseByUpStream.id);
      runInAction(() => {
        Object.assign(state.course, ret.course);
        state.articleList.splice(
          0,
          state.articleList.length,
          ...ret.articleList
        );
        if (ret.articlePage) {
          state.articlePage = ret.articlePage;
        }
        if (ret.cending) {
          state.cending = ret.cending;
        }
      });
    } catch (error) {
      Toast.fail(error.toString());
      Routes.pop();
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchCourseData();
      bus.emit('fetchCourseDataEnd');
    })();
  }, []);

  const changeCending = useCallback(
    action(async (cending: 'desc' | 'asc') => {
      if (state.articlePage) {
        state.articlePage.pageNumber = 0;
        state.articlePage.lastPage = false;
        state.cending = cending;
        state.articleList.splice(0, state.articleList.length);
        await loadMore();
      } else {
        state.articleList = state.articleList.sort((a, b) => {
          if (a.publishAt! < b.publishAt!) {
            return state.cending === 'asc' ? -1 : 1;
          } else {
            return state.cending === 'asc' ? 1 : -1;
          }
        });
      }
      state.cending = cending;
    }),
    []
  );

  const loadMore = useCallback(async () => {
    if (!state.articlePage) return 'ok';
    if (state.articlePage.lastPage) return 'noMore';
    const page = await Article.page(
      state.course.id,
      state.cending,
      state.articlePage.pageNumber + 1,
      10
    );
    runInAction(() => {
      state.articlePage = page;
      state.articleList.push(...page.list);
    });
    return 'ok';
  }, []);

  return (
    <BackableLayout title={state.course.name}>
      <View style={styles.container}>
        <Tabs tabs={[ { title: '文章' }, { title: 'Issue' } ]}>
          <View>
            <ArticleList
              list={state.articleList.slice()}
              page={state.articlePage}
              cending={state.cending}
              onChangeCending={changeCending}
              onRefresh={async () => {
                await fetchCourseData();
              }}
              onLoadMore={loadMore}
            />
          </View>
          <View>
            <Text>issue</Text>
          </View>
        </Tabs>
      </View>
    </BackableLayout>
  );
});

export default Course;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle
});
