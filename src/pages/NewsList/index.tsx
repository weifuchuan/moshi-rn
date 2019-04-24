import { FunctionComponent, useCallback, useEffect, useRef } from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider } from 'react-native-material-ui';
import { formatDate } from '@/kit/functions/moments';
import sleep from '@/kit/functions/sleep';

const NewsList: FunctionComponent = observer(() => {
  const state = useObservable({
    newses: [] as IArticle[],
    lastPage: null as Page<IArticle> | null,
    refreshState: RefreshState.Idle
  });

  const listRef = useRef<RefreshListView>(null);

  const fetchNewses = useCallback(
    async (pageNumber: number, pageSize: number) => {
      const resp = await GET('/srv/v1/news/list', {
        pageNumber,
        pageSize
      });
      const ret = resp.data;
      if (ret.state === 'ok') {
        return ret.page as Page<IArticle>;
      } else throw ret.msg;
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
      await sleep(1000);
      if (!listRef.current!.isFull()) {
        onFooterRefresh(RefreshState.FooterRefreshing);
      }
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
      await sleep(1000);
      if (!listRef.current!.isFull()) {
        onFooterRefresh(RefreshState.FooterRefreshing);
      }
    },
    []
  );

  useEffect(() => {
    onHeaderRefresh(RefreshState.HeaderRefreshing);
  }, []);

  const renderItem = (news: IArticle) => {
    return (
      <Touchable onPress={() => routes.article(news)}>
        <View style={styles.item}>
          <View style={styles.left}>
            <Text style={styles.title}>{news.title}</Text>
            <Text style={styles.publishAt}>{formatDate(news.publishAt!)}</Text>
          </View>
          <View style={styles.right}>
            <MaterialCommunityIcons name={'file-document-outline'} size={24} />
          </View>
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
        style={{ flex: 1, backgroundColor: '#fff' }}
        keyExtractor={(item) => item.id.toString()}
        ref={listRef}
        ItemSeparatorComponent={Divider}
      />
    </BackableLayout>
  );
});

export default NewsList;

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  left: {
    flex: 1
  } as ViewStyle,
  right: {
    justifyContent: 'center',
    paddingLeft: 8
  } as ViewStyle,
  title: {
    fontSize: 16,
    color: '#000'
  } as TextStyle,
  publishAt: {
    fontSize: 12
  } as TextStyle
});
