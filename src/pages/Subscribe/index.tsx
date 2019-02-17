import Touchable from '@/components/Touchable';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/kit';
import { staticBaseUrl } from '@/kit/req';
import BackableLayout from '@/layouts/BackableLayout';
import { ICourse } from '@/models/Course';
import Subscription, { ISubscription } from '@/models/Subscription';
import Routes from '@/Routes';
import { StoreContext } from '@/store';
import ThemeContext from '@/themes';
import { List, Toast } from '@ant-design/react-native';
import RadioItem from '@ant-design/react-native/lib/radio/RadioItem';
import { observer, useObservable } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect
} from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

interface Props {
  course: ICourse;
  navigation: NavigationScreenProp<any>;
}

const Subscribe: FunctionComponent<
  Props
> = observer(({ course, navigation }) => {
  console.log(navigation);
  (global as any).navigation = navigation;

  const theme = useContext(ThemeContext);
  const store = useContext(StoreContext);
  const state = useObservable({
    subscription: null as ISubscription | null,
    timeout: 0,
    coupons: [],
    loading: true,
    payWay: 'qr' as 'qr' | 'wx' | 'alipay'
  });

  const subscribe = useCallback(async () => {
    if (state.subscription) {
      Subscription.delete(state.subscription.id);
    }
    state.loading = true;
    try {
      const { subscription, timeout } = await Subscription.subscribe(
        state.payWay === 'qr'
          ? Subscription.PAY_WAY_QR_TEST
          : state.payWay === 'wx'
            ? Subscription.PAY_WAY_WX
            : Subscription.PAY_WAY_ALIPAY,
        course.id,
        'course',
        state.coupons
      );
      state.subscription = subscription;
      state.timeout = timeout;
    } catch (msg) {
      Toast.fail(msg);
      Routes.pop();
    }
    state.loading = false;
  }, []);

  useEffect(() => {
    subscribe();
  }, []);

  const pay = useCallback(() => {
    if (state.payWay === 'qr') {
      Routes.pay(state.subscription!, state.timeout);
    }
  }, []);

  const onBack = useCallback(() => {
    if (state.subscription) {
      Subscription.delete(state.subscription.id);
    }
    Routes.pop();
  }, []);

  return (
    <BackableLayout title={'结算台'} onBack={onBack}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.BACKGROUND }
        ]}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={[ styles.courseInfo ]}>
            {course.introduceImage ? (
              <Image
                source={{ uri: staticBaseUrl + course.introduceImage }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 5,
                  marginRight: 8
                }}
                resizeMode="stretch"
              />
            ) : null}
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>
                {course.name}
              </Text>
              <Text style={{ color: theme.colors.深石板灰, fontSize: 12 }}>
                {course.lectureCount}讲 | {course.buyerCount}人已学习
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: theme.colors.Tomato, fontSize: 16 }}>
                  ￥{course.discountedPrice &&
                  course.offerTo &&
                  course.offerTo > Date.now() ? (
                    course.discountedPrice
                  ) : (
                    course.price
                  )}
                </Text>
                <Text style={{ fontSize: 12 }}>×1</Text>
              </View>
            </View>
          </View>
          <List>
            {/* TODO: select coupons */}
            <List.Item extra={'无可用优惠券'} arrow="horizontal">
              优惠券
            </List.Item>
            <List.Item
              extra={
                <View>
                  <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                  >
                    <Text style={{ fontSize: 18, color: '#000' }}>总计：</Text>
                    <Text style={{ fontSize: 18, color: theme.colors.Tomato }}>
                      ￥{state.subscription ? state.subscription.cost : 0}
                    </Text>
                  </View>
                </View>
              }
              arrow="empty"
            />
          </List>
          <View style={{ padding: 16 }}>
            <Text>请选择支付方式</Text>
          </View>
          <List>
            <RadioItem
              checked={state.payWay === 'qr'}
              onChange={(e) => {
                if (e.target.checked) state.payWay = 'qr';
              }}
            >
              [Test]二维码支付
            </RadioItem>
            <RadioItem
              disabled
              checked={state.payWay === 'wx'}
              onChange={(e) => {
                if (e.target.checked) state.payWay = 'wx';
              }}
            >
              微信支付
            </RadioItem>
            <RadioItem
              disabled
              checked={state.payWay === 'alipay'}
              onChange={(e) => {
                if (e.target.checked) state.payWay = 'alipay';
              }}
            >
              支付宝支付
            </RadioItem>
          </List>
          <Text
            style={{
              fontSize: 12,
              color: theme.colors.Tomato,
              marginLeft: 16,
              marginTop: 8
            }}
          >
            本商品为虚拟商品，购买后不支持退换、转让
          </Text>
        </ScrollView>
        <Touchable onPress={pay}>
          <View
            style={[
              styles.bottomBar,
              { backgroundColor: theme.colors.Tomato }
            ]}
          >
            <Text style={{ fontSize: 20, color: '#fff' }}>
              ￥{state.subscription ? state.subscription.cost : 0} 确认支付
            </Text>
          </View>
        </Touchable>
        {state.loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={theme.colors.Tomato} size={40} />
          </View>
        ) : null}
      </View>
    </BackableLayout>
  );
});

export default Subscribe;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle,
  bottomBar: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  loading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
    top: 0,
    left: 0
  } as ViewStyle,
  courseInfo: {
    flexDirection: 'row',
    padding: 16
  } as ViewStyle
});
