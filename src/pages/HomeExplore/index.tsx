import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect
} from "react";
import { View, StyleSheet, ViewStyle, Text } from "react-native";
import { observer, useObservable } from "mobx-react-lite";
import HomeLayout from "@/layouts/HomeLayout";
import MoshiWebView from "@/components/MoshiWebView";
import Block from "./Block";
import { Divider } from "react-native-material-ui";
import NewsList from "./NewsList";
import { StoreContext } from "@/store";
import Routes from "@/Routes";

interface Props {}

const HomeExplore: FunctionComponent<Props> = observer(() => {
  const store = useContext(StoreContext);

  const state = useObservable({
    loading: false
  });

  const load = useCallback(async () => {
    state.loading = true;
    try {
      await store.exploreNewsList();
    } catch (err) {}
    state.loading = false;
  }, []);

  useEffect(() => {
    load();
  }, [store.me]);

  return (
    <View style={styles.container}>
      <HomeLayout
        title={"发现"}
        loading={state.loading}
        onRefresh={store.exploreNewsList}
      >
        <Block
          leftTitle={"新闻"}
          rightTitle="查看更多"
          body={
            <NewsList
              newses={
                store.exploreData && store.exploreData.newsList
                  ? store.exploreData.newsList
                  : []
              }
              onNewsPress={news => {
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
          leftTitle={"推荐专栏"}
          rightTitle="查看全部"
          body={
            <View>
              <Text>body</Text>
            </View>
          }
          onRightTitlePress={() => {
            Routes.courseList("column");
          }}
        />
        <Divider />
        <Block
          leftTitle={"推荐视频课程"}
          rightTitle="查看全部"
          body={
            <View>
              <Text>body</Text>
            </View>
          }
          onRightTitlePress={() => {
            Routes.courseList("video");
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
