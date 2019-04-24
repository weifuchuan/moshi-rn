import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props {}

const Communication: FunctionComponent<Props> = observer(() => {
  return (
    <View style={styles.container}>
      <Text>Communication</Text>
    </View>
  );
});

export default Communication;

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
