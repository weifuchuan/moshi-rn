import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';

interface Props {}

const HomeMy: FunctionComponent<Props> = () => {
  return (
    <View style={styles.container}>
      <Text>HomeMy</Text>
    </View>
  );
};

export default observer(HomeMy);

const styles = StyleSheet.create({
  container: {} as ViewStyle
});
