import Touchable from '@/components/Touchable';
import useAnimatedValue from '@/hooks/useAnimatedValue';
import useObject from '@/hooks/useObject';
import { SCREEN_WIDTH } from '@/kit';
import Routes from '@/Routes';
import ThemeContext from '@/themes';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState
} from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StoreContext } from '@/store';
import isUndefOrNull from '@/kit/functions/isUndefOrNull';
import getPlatformElevation from '@/kit/styles/getPlatformElevation';

interface Props {
  title?: string;
  center?: React.ReactElement<any>;
  right?: React.ReactElement<any>;
  onBack?: () => void;
  onScroll?: ((event: NativeSyntheticEvent<NativeScrollEvent>) => void);
  bottom?: React.ReactNode;
  scrollStyle?: ViewStyle;
}

const BackableFloatLayout: FunctionComponent<Props> = ({
  title,
  center,
  right,
  onBack,
  onScroll,
  bottom,
  scrollStyle,
  children
}) => {
  const theme = useContext(ThemeContext);
  const floatTop = useAnimatedValue(-42);
  const lastOffsetY = useObject({ value: 0 });
  const floatTopbarState = useObject({ show: false });

  if (!isUndefOrNull(title) && !center) {
    center = (
      <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>
        {title}
      </Text>
    );
  }

  const showFloatTopbar = useCallback(
    () => {
      floatTop.setValue(-42);
      Animated.timing(floatTop, { toValue: 0, duration: 300 }).start();
    },
    [ floatTop ]
  );
  const hideFloatTopbar = useCallback(
    () => {
      floatTop.setValue(0);
      Animated.timing(floatTop, { toValue: -42, duration: 100 }).start();
    },
    [ floatTop ]
  );

  return (
    <View style={[ styles.container ]}>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.colors.BACKGROUND },
          scrollStyle
        ]}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          if (
            y - lastOffsetY.value < 0 &&
            y > 40 + 40 &&
            !floatTopbarState.show
          ) {
            showFloatTopbar();
            floatTopbarState.show = true;
          } 
           if (
            (y < 40 + 40 || y - lastOffsetY.value > 0) &&
            floatTopbarState.show
          ) {
            hideFloatTopbar();
            floatTopbarState.show = false;
          }
          lastOffsetY.value = y;
          onScroll && onScroll(e);
        }}        
      >
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
      </ScrollView>
      <Animated.View style={[ styles.floatTopbar, { top: floatTop } ]}>
        <View style={[ styles.navbar ]}>
          <View style={[ styles.nbLeft ]}>
            <Touchable onPress={onBack ? onBack : Routes.pop}>
              <MaterialCommunityIcons name="arrow-left" size={24} />
            </Touchable>
          </View>
          <View style={[ styles.nbCenter ]}>{center}</View>
          <View style={[ styles.nbRight ]}>{right}</View>
        </View>
      </Animated.View>
      {bottom}
    </View>
  );
};

export default BackableFloatLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle,
  topbar: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48
  } as ViewStyle,
  floatTopbar: {
    position: 'absolute',
    top: -42,
    left: 0,
    width: SCREEN_WIDTH,
    height: 40,
    // padding: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,

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
