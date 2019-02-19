import ArticleList from '@/components/ArticleList';
import MoshiWebView, { AnyAction } from '@/components/MoshiWebView';
import useObject from '@/hooks/useObject';
import BackableLayout from '@/layouts/BackableLayout';
import Article, { IArticle } from '@/models/Article';
import CourseModel, { ICourse } from '@/models/Course';
import Issue from '@/models/Issue';
import { Page } from '@/models/Page';
import Routes from '@/Routes';
import { StoreContext } from '@/store';
import ThemeContext from '@/themes';
import { Tabs, Toast } from '@ant-design/react-native';
import { action, runInAction, toJS } from 'mobx';
import { observer, useObservable } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef
} from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Touchable from '@/components/Touchable';
import html from './issue-list.html.raw';

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
    cending: 'desc' as 'desc' | 'asc',

    filter: 'open' as 'open' | 'close' | 'your',
    issuePage: null as Page<Issue> | null,
    issueFetching: false,

    tab: 0
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

  const changeArticlesCending = useCallback(
    action(async (cending: 'desc' | 'asc') => {
      if (state.articlePage) {
        state.articlePage.pageNumber = 0;
        state.articlePage.lastPage = false;
        state.cending = cending;
        state.articleList.splice(0, state.articleList.length);
        await loadMoreArticles();
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

  const loadMoreArticles = useCallback(async () => {
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

  const firstViewIssue = useObject({ is: true });

  const issuesWvRef = useRef<MoshiWebView>(null);

  const fetchIssues = useCallback(
    async (filter: 'open' | 'close' | 'your', step?: 'prev' | 'next') => {
      state.issueFetching = true;
      try {
        let pageNumber = 1;
        if (state.issuePage && step) {
          if (step === 'prev' && !state.issuePage.firstPage)
            pageNumber = state.issuePage.pageNumber - 1;
          if (step === 'next' && !state.issuePage.lastPage)
            pageNumber = state.issuePage.pageNumber + 1;
        }
        const page = await Issue.page(state.course.id, filter, pageNumber);
        if(page.totalPage===0){
          page.pageNumber=0; 
        }
        state.issuePage = page;
        issuesWvRef.current!.post({
          action: 'load',
          payload: { page, filter }
        });
        state.filter = filter;
      } catch (err) {
        Toast.fail(err);
      }
      state.issueFetching = false;
    },
    []
  );

  const onMsg = useCallback(async ({ action, payload }: AnyAction) => {
    switch (action) {
      case 'open':
        const id: number = payload;
        const issue = state.issuePage!.list.find((iss) => iss.id === id)!;
        Routes.issue(issue);
        break;
      case 'prev':
        fetchIssues(state.filter, 'prev');
        break;
      case 'next':
        fetchIssues(state.filter, 'next');
        break;
      case 'filter':
        if (payload === 'your' && !store.me) {
          Routes.login();
          return;
        }
        fetchIssues(payload);
        break;
      default:
        break;
    }
  }, []);

  return (
    <BackableLayout
      title={state.course.name}
      right={
        state.tab === 1 ? (
          <Touchable
            onPress={() => {
              Routes.createIssue(state.course, (issue) => {
                Routes.pop(); 
                fetchIssues('open')
              });
            }}
          >
            <Ionicons size={24} name={'ios-create'} />
          </Touchable>
        ) : null
      }
    >
      <View style={styles.container}>
        <Tabs
          style={{ flex: 1 }}
          tabs={[ { title: '文章' }, { title: 'Issue' } ]}
          onChange={(tab, index) => {
            if (index === 1 && firstViewIssue.is) {
              fetchIssues('open');
              firstViewIssue.is = false;
            }
            state.tab = index;
          }}
        >
          <View style={{ flex: 1 }}>
            <ArticleList
              list={state.articleList.slice()}
              page={state.articlePage}
              cending={state.cending}
              onChangeCending={changeArticlesCending}
              onRefresh={async () => {
                await fetchCourseData();
              }}
              onLoadMore={loadMoreArticles}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ScrollView
              style={{ flex: 1 }}
              refreshControl={
                <RefreshControl
                  refreshing={state.issueFetching}
                  onRefresh={() => fetchIssues('open')}
                />
              }
            >
              <View>
                <MoshiWebView
                  source={//{ uri: 'http://192.168.1.18:3001/issue-list.html' }
                  { html, baseUrl: '' }}
                  on={onMsg}
                  ref={issuesWvRef}
                />
              </View>
            </ScrollView>
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
