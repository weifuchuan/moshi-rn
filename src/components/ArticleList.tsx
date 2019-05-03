import RefreshListView, { RefreshState } from '@/components/RefreshListView';
import { SCREEN_WIDTH } from '@/kit';
import { formatDate } from '@/kit/functions/moments';
import { staticBaseUrl } from '@/kit/req';
import { IArticle } from '@/models/Article';
import Routes from '@/Routes';
import { observer, useObservable } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import Touchable from './Touchable';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import { Page } from '@/models/Page';
import Bookmark from './Bookmark';
import _ from 'lodash';

interface Props {
  list: IArticle[];
  page?: Page<IArticle> | null;
  cending: 'desc' | 'asc';
  onChangeCending: (cending: 'desc' | 'asc') => Promise<void>;
  onRefresh: () => Promise<void>;
  onLoadMore: () => Promise<'ok' | 'noMore'>;
}

export default observer(function ArticleList({
  list,
  page,
  cending,
  onChangeCending,
  onRefresh,
  onLoadMore
}: Props) {
  const state = useObservable({
    refreshState: RefreshState.HeaderRefreshing
  });

  const lastVisitArticle = _.maxBy(list, (x) => x.visitAt);

  useEffect(() => {
    const onFetchCourseDataEnd = () => {
      state.refreshState = RefreshState.Idle;
    };
    bus.on('fetchCourseDataEnd', onFetchCourseDataEnd);
    return () => {
      bus.removeListener('fetchCourseDataEnd', onFetchCourseDataEnd);
    };
  }, []);

  return (
    <RefreshListView
      data={list}
      renderItem={({ item, index }) => {
        return (
          <Touchable onPress={() => Routes.article(item, list)}>
            <View style={styles.item}>
              <Text
                style={[ styles.title, item.readed ? {} : { color: '#000' } ]}
              >
                {item.title}
              </Text>
              <View>
                <Text style={{ fontSize: 10 }}>
                  {formatDate(item.publishAt!)}
                </Text>
              </View>
              {item.coverImage ? (
                <Image
                  source={{ uri: staticBaseUrl + item.coverImage }}
                  resizeMode="stretch"
                  style={styles.coverImage}
                />
              ) : null}
              <Text style={{ marginVertical: 8 }}>{item.summary}</Text>
              <View style={styles.bottomBar}>
                <Text style={{ fontSize: 12 }}>阅读原文</Text>
                <SimpleLineIcons name={'arrow-right'} size={12} />
              </View>
              {page ? lastVisitArticle &&
              lastVisitArticle.visitAt! > 0 &&
              lastVisitArticle.id === item.id ? (
                <View style={{ position: 'absolute', top: 0, right: 2 }}>
                  <Bookmark word={'上次阅读'} />
                </View>
              ) : null : (
                <View style={{ position: 'absolute', top: 0, right: 2 }}>
                  <Bookmark word={'试读'} />
                </View>
              )}
            </View>
          </Touchable>
        );
      }}
      keyExtractor={(x) => x.id.toString()}
      ListHeaderComponent={() => {
        return (
          <View style={styles.header}>
            <Touchable
              onPress={async () => {
                state.refreshState = RefreshState.HeaderRefreshing;
                if (cending === 'asc') {
                  await onChangeCending('desc');
                } else {
                  await onChangeCending('asc');
                }
                state.refreshState = RefreshState.Idle;
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Entypo
                  name={cending === 'asc' ? 'arrow-long-up' : 'arrow-long-down'}
                  size={10}
                />
                <Text style={{ fontSize: 12 }}>
                  {cending === 'asc' ? '升序' : '降序'}
                </Text>
              </View>
            </Touchable>
            {page ? (
              <Text style={{ fontSize: 12 }}> | 已更新{page.totalRow}篇</Text>
            ) : null}
          </View>
        );
      }}
      refreshState={state.refreshState}
      onHeaderRefresh={async (rs) => {
        state.refreshState = rs;
        await onRefresh();
        state.refreshState = RefreshState.Idle;
      }}
      onFooterRefresh={async (rs) => {
        state.refreshState = rs;
        const ret = await onLoadMore();
        if (ret === 'ok') state.refreshState = RefreshState.Idle;
        else if (ret === 'noMore') state.refreshState = RefreshState.NoMoreData;
        else state.refreshState = RefreshState.Idle;
      }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.BACKGROUND,
    padding: 4,
    flexDirection: 'row'
  } as ViewStyle,
  item: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff'
  } as ViewStyle,
  title: {
    fontSize: 16,
    marginVertical: 8
  } as TextStyle,
  coverImage: {
    width: SCREEN_WIDTH - 16,
    height: (SCREEN_WIDTH - 16) / 1.8,
    backgroundColor: colors.LightGrey,
    borderRadius: 4
  } as ImageStyle,
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: colors.Lavender
  } as ImageStyle,
  separator: {
    height: 8,
    width: SCREEN_WIDTH,
    backgroundColor: colors.BACKGROUND
  } as ViewStyle
});
