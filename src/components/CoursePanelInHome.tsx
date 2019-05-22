import { ICourse, defaultRealPicture } from '@/models/Course';
import Touchable from './Touchable';
import {
  View,
  ViewStyle,
  StyleSheet,
  Image,
  Text,
  ImageStyle,
  TextStyle
} from 'react-native';
import React from 'react';
import isUndefOrNull from '@/kit/functions/isUndefOrNull';
import Routes from '@/Routes';
import { patchAvatar } from '@/models/Account';

export default function CoursePanelInHome({ course }: { course: ICourse }) {
  let avatarUri = course.realPicture || course.avatar || defaultRealPicture;
  const temp = { avatar: avatarUri };
  patchAvatar(temp);
  avatarUri = temp.avatar;
  return (
    <Touchable 
      onPress={() => {
        if (course.subscribed) {
          Routes.course(course);
        } else Routes.courseIntro(course);
      }}
    >
      <View style={styles.item}>
        <View>
          <Image
            resizeMode="stretch"
            source={{ uri: avatarUri }}
            style={styles.avatar}
          />
        </View>
        <View style={styles.info}>
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#000'
              }}
            >
              {course.name}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12 }}>{course.nickName}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 12 }}>
              {course.lectureCount}讲 | {course.buyerCount}人已学习
            </Text>
          </View>
          <View style={styles.priceBar}>
            {!isUndefOrNull(course.discountedPrice) &&
            course.offerTo &&
            course.offerTo > Date.now() ? (
              <React.Fragment>
                <Text style={styles.timeLimit}>限时</Text>
              </React.Fragment>
            ) : null}
            <Text
              style={{
                color: '#FF6347',
                fontSize: 16,
                marginLeft:
                  !isUndefOrNull(course.discountedPrice) &&
                  course.offerTo &&
                  course.offerTo > Date.now()
                    ? 5
                    : 0
              }}
            >
              ￥{!isUndefOrNull(course.discountedPrice) &&
              course.offerTo &&
              course.offerTo > Date.now() ? (
                course.discountedPrice
              ) : (
                course.price
              )}
            </Text>
            {!isUndefOrNull(course.discountedPrice) &&
            course.offerTo &&
            course.offerTo > Date.now() ? (
              <React.Fragment>
                <Text style={styles.price}>￥{course.price}</Text>
              </React.Fragment>
            ) : null}
          </View>
        </View>
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#fff'
  } as ViewStyle,
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  } as ViewStyle,
  list: {} as ViewStyle,
  item: {
    paddingVertical: 8,
    flexDirection: 'row'
  } as ViewStyle,
  avatar: {
    width: 80,
    height: 80 / 2.5 * 3.5,
    borderRadius: 20,
    backgroundColor: colors.LightGrey
  } as ImageStyle,
  info: {
    flex: 1,
    marginLeft: 8,
    justifyContent: 'space-evenly'
  } as ViewStyle,
  priceBar: {
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  timeLimit: {
    color: '#DC143C',
    fontSize: 10,
    paddingVertical: 0,
    paddingHorizontal: 2,
    borderColor: '#DC143C',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderRadius: 5
  } as TextStyle,
  price: {
    textDecorationLine: 'line-through',
    color: '#778899',
    fontSize: 12,
    marginLeft: 5
  } as TextStyle
});
