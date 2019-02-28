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
              <View style={styles.itemLeft} >
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
              </View>
              <View>
                
              </View>
            </View>
          </Touchable>
        );
      }}
      keyExtractor={(x) => x.id.toString()}
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
    backgroundColor: '#fff',
    flexDirection:"row", 
    alignItems:"center"
  } as ViewStyle,
  itemLeft:{
    flex:1, 
    justifyContent:"space-between"
  }as ViewStyle,
  title: {
    fontSize: 16,
    marginVertical: 8
  } as TextStyle,
  coverImage: {
    width: SCREEN_WIDTH - 16,
    height: (SCREEN_WIDTH - 16) / 1.8
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
