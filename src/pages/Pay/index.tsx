import BackableLayout from '@/layouts/BackableLayout';
import { ISubscription } from '@/models/Subscription';
import Routes from '@/Routes';
import { Modal, Toast } from '@ant-design/react-native';
import { observer, useObservable } from 'mobx-react-lite';
import React, { FunctionComponent } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Subscription from '@/models/Subscription';
import Qr from './Qr';
import Course, { ICourse } from '@/models/Course';
import {
  NavigationScreenProp,
  NavigationActions,
  StackActions
} from 'react-navigation';
import { timer } from 'rxjs';

interface Props {
  subscription: ISubscription;
  timeout: number;
  navigation: NavigationScreenProp<any>;
}

const Pay: FunctionComponent<
  Props
> = observer(({ subscription, timeout, navigation }) => {
  const state = useObservable({
    status: 'init' as 'init' | 'success' | 'fail' | 'cancel'
  });

  let comp;
  switch (subscription.payWay) {
    case Subscription.PAY_WAY_QR_TEST:
      comp = (
        <Qr
          subscription={subscription}
          timeout={timeout}
          onSuccess={() => {
            state.status = 'success';
            Toast.success('订阅成功');
            if (subscription.subscribeType === Subscription.SUB_TYPE_COURSE) {
              const course = new Course();
              course.id = subscription.refId;
              course.subscribed = true;
              navigation.dispatch(StackActions.popToTop({}));
              setTimeout(() => {
                Routes.course(course);
              }, 300);
            }
          }}
          onCancel={() => {
            state.status = 'cancel';
            Subscription.cancel(subscription.id);
            Toast.info('已取消');
            Routes.popTo('courseIntro');
          }}
          onFail={() => {
            state.status = 'fail';
            Subscription.fail(subscription.id);
            Toast.fail('已失败');
            Routes.popTo('courseIntro');
          }}
        />
      );
      break;
    case Subscription.PAY_WAY_WX:
      // TODO: weixin pay
      break;
    case Subscription.PAY_WAY_ALIPAY:
      // TODO: Alipay
      break;
  }

  return (
    <BackableLayout
      title={'收银台'}
      onBack={() => {
        Modal.alert('警告', <Text>支付尚未完成，退出将取消订单。</Text>, [
          {
            text: '退出',
            onPress: () => {
              Subscription.cancel(subscription.id);
              Routes.pop();
            }
          },
          { text: '取消', onPress: () => {} }
        ]);
      }}
    >
      <View style={styles.container}>{comp}</View>
    </BackableLayout>
  );
});

export default Pay;

const styles = StyleSheet.create({
  container: {
    flex: 1
  } as ViewStyle
});
