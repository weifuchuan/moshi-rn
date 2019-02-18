import Touchable from '@/components/Touchable';
import isUndefOrNull from '@/kit/functions/isUndefOrNull';
import getPlatformElevation from '@/kit/styles/getPlatformElevation';
import Routes from '@/Routes';
import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  title?: string;
  center?: React.ReactNode;
  right?: React.ReactNode;
  onBack?: () => void;
}

const BackableLayout: FunctionComponent<Props> = ({
  title,
  center,
  right,
  onBack,
  children
}) => {
  if (!isUndefOrNull(title) && !center) {
    center = (
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
        {title}
      </Text>
    );
  }

  return (
    <React.Fragment>
      <View style={[ styles.navbar ]}>
        <View style={[ styles.nbLeft ]}>
          <Touchable onPress={onBack ? onBack : Routes.pop}>
            <MaterialCommunityIcons name="arrow-left" size={24} />
          </Touchable>
        </View>
        <View style={[ styles.nbCenter ]}>{center}</View>
        <View style={[ styles.nbRight ]}>{right}</View>
      </View>
      {children}
    </React.Fragment>
  );
};

export default BackableLayout;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    zIndex: 1,
    ...getPlatformElevation(2)
  } as ViewStyle,
  nbLeft: {
    flex: 1
  } as ViewStyle,
  nbCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  } as ViewStyle,
  nbRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  } as ViewStyle
});
