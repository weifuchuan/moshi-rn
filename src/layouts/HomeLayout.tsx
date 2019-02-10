import Touchable from '@/components/Touchable';
import useAnimatedValue from '@/hooks/useAnimatedValue';
import useObject from '@/hooks/useObject';
import { SCREEN_WIDTH } from '@/kit';
import Routes from '@/Routes';
import ThemeContext from '@/themes';
import React, { FunctionComponent, useCallback, useContext } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  title: string;
}

const HomeLayout: FunctionComponent<Props> = ({ title, children }) => {
  const theme = useContext(ThemeContext);
  const floatTop = useAnimatedValue(-40);
  const lastOffsetY = useObject({ value: 0 });
  const floatTopbarState = useObject({ show: false });

  const showFloatTopbar = useCallback(
    () => {
      floatTop.setValue(-40);
      Animated.timing(floatTop, { toValue: 0, duration: 300 }).start();
    },
    [ floatTop ]
  );
  const hideFloatTopbar = useCallback(
    () => {
      floatTop.setValue(0);
      Animated.timing(floatTop, { toValue: -40, duration: 100 }).start();
    },
    [ floatTop ]
  );

  return (
    <View style={[ styles.container ]}>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: theme.colors.BACKGROUND }
        ]}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          console.info(y); 
          if (y - lastOffsetY.value > 0 && y > 40 && !floatTopbarState.show) {
            showFloatTopbar();
            floatTopbarState.show = true; 
          } else if (
            y - lastOffsetY.value < 0 &&
            y < 40+48 &&
            floatTopbarState.show
          ) {
            hideFloatTopbar();
            floatTopbarState.show = false; 
          }
          lastOffsetY.value = y;
        }}
      >
        <View style={[ styles.topbar ]}>
          <Text style={{ fontSize: 24, color: '#000', fontWeight: 'bold' }}>
            {title}
          </Text>
          <Touchable
            onPress={() => {
              Routes.drawerOpen();
            }}
          >
            <MaterialCommunityIcons name="account" size={24} />
          </Touchable>
        </View>
        {children}
      </ScrollView>
      <Animated.View style={[ styles.floatTopbar, { top: floatTop } ]}>
        <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold' }}>
          {title}
        </Text>
        <Touchable
          onPress={() => {
            Routes.drawerOpen();
          }}
        >
          <MaterialCommunityIcons
            name="account"
            size={20}
            style={{ position: 'absolute', right: 8, top: 10 }}
          />
        </Touchable>
      </Animated.View>
    </View>
  );
};

export default HomeLayout;

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
    top: -40,
    left: 0,
    width: SCREEN_WIDTH,
    height: 40,
    padding: 8,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle
});
