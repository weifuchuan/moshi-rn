import React, { FunctionComponent } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Text,
  Image,
  ImageStyle
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { ICourse, defaultRealPicture } from '@/models/Course';
import { staticBaseUrl } from '@/kit/req';
import Touchable from './Touchable';
import Routes from '@/Routes';

interface Props {
  courses: ICourse[];
  courseType: string;
  onViewAll: () => void;
}

const CoursesPanel: FunctionComponent<Props> = ({
  courseType,
  courses,
  onViewAll
}) => {
  return (
    <View style={[ styles.container ]}>
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
                Routes.course(course.id);
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
                  <View style={styles.priceBar} >
                      {course.offerTo}
                    <Text>{course.name}</Text>
                  </View>
                </View>
              </View>
            </Touchable>
          );
        })}
      </View>
    </View>
  );
};

export default observer(CoursesPanel);

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
  priceBar:{
    flexDirection:"row", 
    alignItems:"center"
  } as ViewStyle,
});
