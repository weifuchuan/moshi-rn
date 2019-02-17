import React, { FunctionComponent } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  Image,
  ImageStyle,
  TextStyle
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { ICourse, defaultRealPicture } from '@/models/Course';
import { staticBaseUrl } from '@/kit/req';
import Touchable from '@/components/Touchable';
import Routes from '@/Routes';
import isUndefOrNull from '@/kit/functions/isUndefOrNull';

interface Props {
  courses: ICourse[];
  courseType: string;
  onViewAll: () => void;
  containerStyle?:ViewStyle; 
}

const CoursesPanel: FunctionComponent<
  Props
> = observer(({ courseType, courses, onViewAll,containerStyle }) => {
  return (
    <View style={[ styles.container,containerStyle ]}>
      <View style={styles.topbar}>
        <Text style={{ color: '#000', fontSize: 20, fontWeight: 'bold' }}>
          {courseType}
        </Text>
        <Text style={{ fontSize: 14 }} onPress={onViewAll}>
          查看全部
        </Text>
      </View>
      <View style={styles.list}>
        {courses.map((course) => {
          let avatarUri =
            course.realPicture || course.avatar || defaultRealPicture;
          if (__DEV__ && !avatarUri.startsWith('data:')) {
            avatarUri = staticBaseUrl + avatarUri;
          }
          return (
            <Touchable
              key={course.id}
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
        })}
      </View>
    </View>
  );
});

export default CoursesPanel;

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
    borderRadius: 20
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
