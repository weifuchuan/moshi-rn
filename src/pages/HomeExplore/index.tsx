import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import HomeLayout from '../../layouts/HomeLayout';
import WebView2 from '@/components/WebView2';

interface Props {}

const HomeExplore: FunctionComponent<Props> = () => {
  return (
    <View style={styles.container}>
      <HomeLayout title={'发现'}>
        <WebView2 source={{ html: 'TODO' }} />
      </HomeLayout>
    </View>
  );
};

export default observer(HomeExplore);

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle
});
