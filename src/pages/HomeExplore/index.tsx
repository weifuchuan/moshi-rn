import React, { FunctionComponent, useContext } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import HomeLayout from '@/layouts/HomeLayout';
import MoshiWebView from '@/components/MoshiWebView';
import Block from './Block';
import { Divider } from 'react-native-material-ui';
import NewsList from './NewsList';
import { StoreContext } from '@/store';
import Routes from '@/Routes';

interface Props {}

const HomeExplore: FunctionComponent<Props> = observer(() => {
  const store = useContext(StoreContext);

  return (
    <View style={styles.container}>
      <HomeLayout title={'发现'}>
        <Block
          leftTitle={'新闻'}
          rightTitle="查看更多"
          body={
            <NewsList
              newses={store.exploreData ? store.exploreData.newsList : []}
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
              <Text>body</Text>
            </View>
          }
          onRightTitlePress={() => {
            Routes.courseList('column');
          }}
        />
        <Block
          leftTitle={'推荐视频课程'}
          rightTitle="查看全部"
          body={
            <View>
              <Text>body</Text>
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
