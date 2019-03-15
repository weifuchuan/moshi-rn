import { FunctionComponent, useCallback, useEffect } from 'react';
import { observer, useObservable } from 'mobx-react-lite';
import BackableLayout from '@/layouts/BackableLayout';
import React from 'react';
import RefreshListView, {
  RefreshState,
  RefreshStateType
} from '@/components/RefreshListView';
import { StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { GET } from '@/kit/req';
import { Page } from '@/models/Page';
import { IArticle } from '@/models/Article';
import { runInAction } from 'mobx';
import Touchable from '@/components/Touchable';
import routes from '@/Routes';
import Entypo from 'react-native-vector-icons/Entypo';

const NewsList: FunctionComponent = observer(() => {
  const state = useObservable({
    newses: [] as IArticle[],
    lastPage: null as Page<IArticle> | null,
    refreshState: RefreshState.Idle
  });

  const fetchNewses = useCallback(
    async (pageNumber: number, pageSize: number) => {
      const resp = await GET<Page<IArticle>>('/srv/v1/news/list', {
        pageNumber,
        pageSize
      });
      const page = resp.data;
      return page;
    },
    []
  );

  const onHeaderRefresh = useCallback(
    async (refreshState: RefreshStateType) => {
      state.refreshState = refreshState;
      const page = await fetchNewses(1, 10);
      runInAction(() => {
        state.lastPage = page;
        state.newses.splice(0, state.newses.length, ...page.list);
        state.refreshState = RefreshState.Idle;
      });
    },
    []
  );

  const onFooterRefresh = useCallback(
    async (refreshState: RefreshStateType) => {
      state.refreshState = refreshState;
      let pageNumber = 1;
      if (state.lastPage) {
        if (state.lastPage.lastPage) {
          state.refreshState = RefreshState.NoMoreData;
          return;
        }
        pageNumber = state.lastPage.pageNumber + 1;
      }
      const page = await fetchNewses(pageNumber, 10);
      runInAction(() => {
        state.lastPage = page;
        state.newses.push(...page.list);
        if (page.lastPage) {
          state.refreshState = RefreshState.NoMoreData;
        } else {
          state.refreshState = RefreshState.Idle;
        }
      });
    },
    []
  );

  useEffect(() => {
    onHeaderRefresh(RefreshState.HeaderRefreshing);
  }, []);

  const renderItem = (news: IArticle) => {
    return (
      <Touchable key={news.id} onPress={() => routes.article(news)}>
        <View style={styles.item}>
          <Entypo name={'news'} size={16} />
          <Text style={styles.title}>{news.title}</Text>
        </View>
      </Touchable>
    );
  };

  return (
    <BackableLayout title="新闻">
      <RefreshListView
        data={state.newses.slice()}
        renderItem={({ item }) => renderItem(item)}
        refreshState={state.refreshState}
        onHeaderRefresh={onHeaderRefresh}
        onFooterRefresh={onFooterRefresh}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id.toString()}
      />
    </BackableLayout>
  );
});

export default NewsList;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  title: {
    fontSize: 16,
    paddingLeft: 4
  } as TextStyle
});
