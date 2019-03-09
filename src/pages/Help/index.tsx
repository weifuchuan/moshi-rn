import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props {}

const Help: FunctionComponent<Props> = observer(() => {
  return (
    <View style={styles.container}>
      <Text>Help</Text>
    </View>
  );
});

export default Help;

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
