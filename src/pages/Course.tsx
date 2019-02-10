import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props {
  id:number;
}

const Course: FunctionComponent<Props> = ({id}) => {
  return (
    <View style={styles.container}>
      <Text>Course {id}</Text>
    </View>
  );
};

export default observer(Course);

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
