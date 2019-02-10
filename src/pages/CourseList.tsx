import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props { 
  type:"column"|"video"
}

const CourseList: FunctionComponent<Props> = ({type}) => {
  return (
    <View style={styles.container}>
      <Text>CourseList</Text>
    </View>
  );
};

export default observer(CourseList);

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
