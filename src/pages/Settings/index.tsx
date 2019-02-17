import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props {}

const Settings: FunctionComponent<Props> = observer(() => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
});

export default Settings;

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
