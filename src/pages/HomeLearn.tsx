import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props {}

const HomeLearn: FunctionComponent<Props> = () => {
  return (
    <View style={styles.container}>
      <Text>HomeLearn</Text>
    </View>
  );
};

export default observer(HomeLearn);

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
