import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import HomeLayout from '@/layouts/HomeLayout';
import MoshiWebView from '@/components/MoshiWebView';

interface Props {}

const HomeExplore: FunctionComponent<Props> = observer(() => {
  return (
    <View style={styles.container}>
      <HomeLayout title={'发现'}>
        <Text>toooo</Text>
      </HomeLayout>
    </View>
  );
});

export default HomeExplore;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle
});
