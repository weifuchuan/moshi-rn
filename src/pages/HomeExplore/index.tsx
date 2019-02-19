import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import HomeLayout from '../../layouts/HomeLayout';
import MoshiWebView from '@/components/MoshiWebView';

interface Props {}

const HomeExplore: FunctionComponent<Props> = () => {
  return (
    <View style={styles.container}>
      <HomeLayout title={'发现'}>
        <MoshiWebView source={{ html: 'TODO' }} />
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
