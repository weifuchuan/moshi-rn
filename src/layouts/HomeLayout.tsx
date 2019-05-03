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
  ActivityIndicator
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StoreContext } from '@/store';
import MessagingIcon from '@/components/MessagingIcon';

interface Props {
  title: string;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

const HomeLayout: FunctionComponent<Props> = ({
  title,
  loading,
  onRefresh,
  children
}) => {
  const theme = useContext(ThemeContext);
  const store = useContext(StoreContext);
  const floatTop = useAnimatedValue(-40);
  const lastOffsetY = useObject({ value: 0 });
  const floatTopbarState = useObject({ show: false });
  const [ refreshing, setRefreshing ] = useState(false);

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              // try {
              //   await store.explore();
              // } catch (e) {}
              if (onRefresh) {
                await onRefresh();
              }
              setRefreshing(false);
            }}
          />
        }
        style={[
          styles.container,
          { backgroundColor: theme.colors.BACKGROUND }
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          if (y - lastOffsetY.value > 0 && y > 40 && !floatTopbarState.show) {
            showFloatTopbar();
            floatTopbarState.show = true;
          } else if (
            y - lastOffsetY.value < 0 &&
            y < 40 + 48 &&
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
          <View style={{ flexDirection: 'row' }}>
            <MessagingIcon />
            <Touchable
              onPress={() => {
                Routes.drawerOpen();
              }}
            >
              <MaterialCommunityIcons name="account" size={24} />
            </Touchable>
          </View>
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
      {loading ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1
          }}
        >
          <ActivityIndicator size="large" color={colors.DoderBlue} />
        </View>
      ) : null}
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
