import React, { FunctionComponent, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  ScrollView,
  Image,
  ImageStyle
} from 'react-native';
import { observer, useObservable } from 'mobx-react-lite';
import BackableLayout from '@/layouts/BackableLayout';
import Course, { ICourse } from '@/models/Course';
import CourseModel from '@/models/Course';
import ContentPanel from '@/components/ContentPanel';
import { SCREEN_WIDTH } from '@/kit';
import { staticBaseUrl } from '@/kit/req';
import { SCREEN_HEIGHT } from '@/kit';
import Touchable from '@/components/Touchable';
import ThemeContext from '@/themes';
import Routes from '@/Routes';
import { StoreContext } from '@/store';
import { TextStyle } from 'react-native';
import {useEasyrecView} from "@/hooks/useEasyrec";

interface Props {
  course: ICourse;
}

const CourseIntro: FunctionComponent<
  Props
> = observer(({ course: courseByUpStream }) => {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);

  useEasyrecView(courseByUpStream.id,"course")

  const state = useObservable({
    course: CourseModel.from(courseByUpStream)
  });

  useEffect(() => {
    Course.visit(courseByUpStream.id);
    if (courseByUpStream.subscribed) {
    } else
      CourseModel.intro(courseByUpStream.id).then(
        (course) => (state.course = course)
      );
  }, []);

  let bottomBar;
  if (!state.course.subscribed) {
    let buyBtn;
    if (
      state.course.discountedPrice &&
      state.course.offerTo &&
      state.course.offerTo > Date.now()
    ) {
      buyBtn = (
        <React.Fragment>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            限时￥{state.course.discountedPrice}
          </Text>
          <Text
            style={{
              color: '#DCDCDC',
              fontSize: 12,
              textDecorationLine: 'line-through'
            }}
          >
            ￥{state.course.discountedPrice}
          </Text>
        </React.Fragment>
      );
    } else {
      buyBtn = (
        <React.Fragment>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            ￥{state.course.price}
          </Text>
        </React.Fragment>
      );
    }
    bottomBar = (
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.colors.BACKGROUND }
        ]}
      >
        <Touchable onPress={() => Routes.course(state.course)}>
          <View
            style={[
              styles.bottomBtn,
              {
                borderColor: theme.colors.Orange,
                borderWidth: 1,
                backgroundColor: '#fff',
                flex: 1.2
              }
            ]}
          >
            <Text style={{ color: theme.colors.Orange, fontSize: 16 }}>
              免费试读
            </Text>
          </View>
        </Touchable>
        <Touchable
          onPress={() =>
            store.me ? Routes.subscribe(state.course) : Routes.login()}
        >
          <View
            style={[
              styles.bottomBtn,
              {
                borderColor: theme.colors.Tomato,
                borderWidth: 1,
                backgroundColor: theme.colors.Tomato,
                flex: 2
              }
            ]}
          >
            {buyBtn}
          </View>
        </Touchable>
      </View>
    );
  }

  return (
    <BackableLayout title={state.course.name}>
      <React.Fragment>
        <View style={styles.container}>
          <ScrollView style={{ height: SCREEN_HEIGHT - 56 }}>
            <View style={styles.scrollViewChild}>
              {state.course.introduceImage ? (
                <Image
                  source={{
                    uri: staticBaseUrl + state.course.introduceImage
                  }}
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_WIDTH * (1 / 2),
                    backgroundColor: colors.LightGrey,
                    borderRadius: 4
                  }}
                  resizeMode="stretch"
                />
              ) : null}
              <View style={styles.authorInfo}>
                <View>
                  <Image
                    source={{ uri: staticBaseUrl + state.course.avatar }}
                    style={[
                      styles.authorInfoAvatar,
                      {
                        borderColor: theme.colors.亮灰色,
                        backgroundColor: colors.LightGrey,
                        borderRadius: 4
                      }
                    ]}
                  />
                </View>
                <View style={styles.authorInfoRight}>
                  <View style={styles.authorInfoRightTop}>
                    <Text style={styles.authorInfoRightTopNickname}>
                      {state.course.nickName}
                    </Text>
                    <Text>{state.course.buyerCount}人购买</Text>
                  </View>
                  <View>
                    <Text>{state.course.personalProfile}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: theme.colors.BACKGROUND,
                  height: 8,
                  width: SCREEN_WIDTH
                }}
              />
              <ContentPanel content={state.course.introduce} type={'html'} />
            </View>
          </ScrollView>
          {bottomBar}
        </View>
      </React.Fragment>
    </BackableLayout>
  );
});

export default CourseIntro;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle,
  scrollViewChild: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white'
  } as ViewStyle,
  bottomBar: {
    flexDirection: 'row',
    padding: 8,
    height: 56,
    alignItems: 'center'
  } as ViewStyle,
  bottomBtn: {
    marginHorizontal: 4,
    borderRadius: 5,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  authorInfo: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row'
  } as ViewStyle,
  authorInfoAvatar: {
    borderWidth: 2,
    borderRadius: 28,
    width: 56,
    height: 56
  } as ImageStyle,
  authorInfoRight: {
    marginLeft: 8,
    justifyContent: 'space-between',
    flex: 1
  } as ViewStyle,
  authorInfoRightTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as ViewStyle,
  authorInfoRightTopNickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  } as TextStyle
});
