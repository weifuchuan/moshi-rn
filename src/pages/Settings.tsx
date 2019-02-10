import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props {}

const Settings: FunctionComponent<Props> = () => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
};

export default observer(Settings);

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
