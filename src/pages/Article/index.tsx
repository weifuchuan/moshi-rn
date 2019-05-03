import Touchable from "@/components/Touchable";
import MoshiWebView from "@/components/MoshiWebView";
import useAnimatedValue from "@/hooks/useAnimatedValue";
import useObject from "@/hooks/useObject";
import { SCREEN_WIDTH } from "@/kit";
import markdownToHtml from "@/kit/functions/markdownToHtml";
import { staticBaseUrl } from "@/kit/req";
import getPlatformElevation from "@/kit/styles/getPlatformElevation";
import BackableFloatLayout from "@/layouts/BackableFloatLayout";
import ArticleModel, { IArticle } from "@/models/Article";
import Routes from "@/Routes";
import { StoreContext } from "@/store";
import { observer, useObservable } from "mobx-react-lite";
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef
} from "react";
import { Animated, StyleSheet, Text, View, ViewStyle } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AnyAction } from "../../components/MoshiWebView";
import html from "./article.html.raw";
import { Tabs } from "@ant-design/react-native";
import { patchAvatar } from "@/models/Account";
import { useEasyrecView } from "@/hooks/useEasyrec";

interface Props {
  article: IArticle;
  list?: IArticle[];
}

const Article: FunctionComponent<Props> = observer(({ article, list }) => {
  const store = useContext(StoreContext);
  const state = useObservable({
    article: ArticleModel.from(article)
  });

  const wvRef = useRef<MoshiWebView>(null);

  useEffect(() => {
    (async () => {
      try {
        state.article = await ArticleModel.fetch(article.id);
        if (state.article.audio) {
          const audioUrl = staticBaseUrl + state.article.audio.resource;
          state.article.audio.resource = audioUrl;
        }
        if (state.article.contentType === "md") {
          state.article.content = await markdownToHtml(state.article.content);
        }
        if (state.article.comments) {
          const contents = state.article.comments.map(c =>
            markdownToHtml(c.content)
          );
          const contentHtmls = await Promise.all(contents);
          state.article.comments.forEach((c, i) => {
            patchAvatar(c);
            c.content = contentHtmls[i];
          });
        }
        wvRef.current!.post<AnyAction>({
          action: "load",
          payload: {
            article: state.article,
            prev: prev ? prev.title : undefined,
            next: next ? next.title : undefined
          }
        });
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  useEasyrecView(article.courseId, "course");
  useEasyrecView(article.id, "article");

  let prev: IArticle | undefined = undefined;
  let next: IArticle | undefined = undefined;
  if (list) {
    let index = list.findIndex(x => x.id === article.id);
    if (index !== -1) {
      let cending =
        list[0].publishAt! < list[list.length - 1].publishAt! ? "asc" : "desc";
      if (cending === "asc") {
        prev = index > 0 ? list[index - 1] : undefined;
        next = index < list.length - 1 ? list[index + 1] : undefined;
      } else {
        next = index > 0 ? list[index - 1] : undefined;
        prev = index < list.length - 1 ? list[index + 1] : undefined;
      }
    }
  }

  const animatedBottom = useAnimatedValue(0);
  const animatedHeight = useAnimatedValue(40);
  const scrollState = useObject({ show: true, lastOffsetY: 0 });
  const show = useCallback(() => {
    if (!scrollState.show) {
      animatedHeight.setValue(0);
      Animated.timing(animatedHeight, {
        toValue: 40,
        duration: 300
      }).start();
      animatedBottom.setValue(-40);
      Animated.timing(animatedBottom, {
        toValue: 0,
        duration: 300
      }).start();
      scrollState.show = true;
    }
  }, []);
  const hide = useCallback(() => {
    if (scrollState.show) {
      animatedHeight.setValue(40);
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300
      }).start();
      animatedBottom.setValue(0);
      Animated.timing(animatedBottom, {
        toValue: -40,
        duration: 300
      }).start();
      scrollState.show = false;
    }
  }, []);

  const onMsg = useCallback(async ({ action, payload }: AnyAction) => {
    switch (action) {
      case "jump":
        if (payload === "prev") {
          Routes.article(prev!, list);
        } else if (payload === "next") {
          Routes.article(next!, list);
        }
        break;
      case "refresh":
        Routes.refresh({ article, list });
        break;
      default:
        break;
    }
  }, []);

  const comment = useCallback(async () => {
    if (store.me)
      Routes.articleComment(article, comment => {
        Routes.pop();
        state.article.comments.unshift(comment);
        comment.avatar = staticBaseUrl + comment.avatar;
        wvRef.current!.post({ action: "addComment", payload: comment });
      });
    else Routes.login();
  }, []);

  return (
    <BackableFloatLayout
      bottom={
        <React.Fragment>
          <Animated.View
            style={{
              height: animatedHeight,
              backgroundColor: "#fff",
              width: SCREEN_WIDTH
            }}
          />
          <Animated.View style={[styles.bottom, { bottom: animatedBottom }]}>
            <Touchable onPress={() => {}}>
              <View style={styles.bottomItem}>
                <Ionicons
                  name="ios-heart"
                  color={article.liked ? colors.Tomato : colors.暗淡的灰色}
                  size={20}
                />
                <Text style={{ fontSize: 12 }}>{article.likeCount || 0}</Text>
              </View>
            </Touchable>
            <Touchable onPress={comment}>
              <View style={styles.bottomItem}>
                <Ionicons
                  name="ios-create"
                  color={article.liked ? colors.Tomato : colors.暗淡的灰色}
                  size={20}
                />
                <Text style={{ fontSize: 12 }}>写留言</Text>
              </View>
            </Touchable>
          </Animated.View>
        </React.Fragment>
      }
      onScroll={e => {
        const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
        const height = e.nativeEvent.contentSize.height;
        const y = e.nativeEvent.contentOffset.y;
        const lastY = scrollState.lastOffsetY;
        if (
          y - lastY > 0 &&
          height - (y + scrollViewHeight) >= 120 &&
          scrollState.show
        ) {
          hide();
        } else if (
          (y - lastY < 0 || height - (y + scrollViewHeight) < 120) &&
          !scrollState.show
        ) {
          show();
        }
        scrollState.lastOffsetY = y;
      }}
    >
      <View>
        <MoshiWebView
          ref={wvRef}
          source={
            //    { uri: 'http://192.168.1.18:3001/article.html' }
            { html, baseUrl: "" }
          }
          scalesPageToFit={false}
          on={onMsg}
          overScrollMode="content"
        />
      </View>
    </BackableFloatLayout>
  );
});

export default Article;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle,
  bottom: {
    position: "absolute",
    zIndex: 100,
    left: 0,
    bottom: 0,
    height: 38,
    width: SCREEN_WIDTH,
    backgroundColor: "#fff",
    ...getPlatformElevation(4),
    flexDirection: "row"
  } as ViewStyle,
  bottomItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  } as ViewStyle
});
