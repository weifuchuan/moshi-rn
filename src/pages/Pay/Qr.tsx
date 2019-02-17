import Touchable from '@/components/Touchable';
import useCountdown from '@/hooks/useCountdown';
import genKey from '@/kit/functions/genKey';
import { baseUrl, Ret } from '@/kit/req';
import Subscription, { ISubscription } from '@/models/Subscription';
import Routes from '@/Routes';
import { Toast } from '@ant-design/react-native';
import { observer, useObservable } from 'mobx-react-lite';
import qs from 'qs';
import React, { useCallback, useEffect, useState } from 'react';
import { CameraRoll, Image, ImageStyle, Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Overlay } from 'react-native-elements';
import RNFS from 'react-native-fs';
import { Button } from 'react-native-material-ui';
import RNFetchBlob from 'rn-fetch-blob';
import io from 'socket.io-client';

interface Props {
  subscription: ISubscription;
  timeout: number;
  onSuccess: () => void;
  onFail: () => void;
  onCancel: () => void;
}

export default observer(function Qr({
  subscription,
  timeout,
  onSuccess,
  onCancel,
  onFail
}: Props) {
  const [ qr, setQr ] = useState(loadingImage);

  const state = useObservable({
    isVisible: false,
    connected: false
  });

  const fetchQr = useCallback(() => {
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      fileCache: true
    })
      .fetch(
        'get',
        baseUrl +
          '/srv/v1/subscribe/qr?' +
          qs.stringify({ id: subscription.id })
      )
      .then(async (res) => {
        let path =
          Platform.OS === 'android' ? 'file://' + res.path() : '' + res.path();
        let destPath =
          path.substring(0, path.lastIndexOf('/') + 1) + genKey() + '.png';
        await RNFS.moveFile(path, destPath);
        setQr(destPath);
      })
      .catch((err) => {
        Toast.fail('' + err);
        Routes.pop();
      });
  }, []);

  const connect = useCallback(async () => {
    let socket: SocketIOClient.Socket;
    try {
      const ret = await Subscription.confirm(subscription);
      const key = ret['key'];
      const url = ret['url'];
      socket = io(url);
      socket.on('connect', () => {
        if (!state.connected)
          socket.emit('confirm', {
            type: 'verify',
            payload: JSON.stringify({
              key,
              id: subscription.id
            })
          });
      });
      socket.on('verify', (ret: Ret) => { 
        if (ret.state === 'ok') {
          state.connected = true;
        } else {
          Toast.fail('连接到后台失败');
          onFail();
        }
      });
      socket.on('result', (ret: Ret) => {
        if (ret.state === 'ok') {
          onSuccess();
        } else {
          Toast.fail(ret.msg);
          onFail();
        }
      });
      socket.on('error', (error: any) => {
        console.warn(error);
      });
      socket.open();
    } catch (err) {
      console.error(err);
    }
    return () => {
      socket.disconnect();
    };
  }, []);

  const count = useCountdown(timeout * 60);

  useEffect(() => {
    fetchQr();
    const disc = connect();
    return () => {
      disc.then((f) => f());
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>
        还剩余 {Math.floor(count / 60)}:{Math.floor(count % 60)} 订单过期，请及时扫码
      </Text>
      <Touchable
        onLongPress={() => {
          state.isVisible = true;
        }}
      >
        <Image
          style={styles.qr}
          resizeMode={'stretch'}
          source={{ uri: state.connected ? qr : loadingImage }}
        />
      </Touchable>
      <Overlay
        onRequestClose={() => (state.isVisible = false)}
        onBackdropPress={() => (state.isVisible = false)}
        isVisible={state.isVisible}
        containerStyle={{ justifyContent: 'center' }}
        overlayStyle={{ justifyContent: 'center' }}
        height={120}
      >
        <View style={{}}>
          <Button
            primary
            text={'保存到手机'}
            onPress={async () => {
              const path = await CameraRoll.saveToCameraRoll(qr, 'photo');
              Toast.success('保存成功');
              state.isVisible = false;
            }}
          />
          <Button
            style={{ container: { marginTop: 16 } }}
            text={'取消'}
            onPress={() => (state.isVisible = false)}
          />
        </View>
      </Overlay>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  qr: {
    marginTop: 32,
    width: 200,
    height: 200
  } as ImageStyle
});

const loadingImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAABGdBTUEAALGPC/xhBQAAIn1JREFUeAHt3WmT3MQBBuAxp8Ec5jKG2BhDYkIqSaUqVfmQ//8hqVTlqpAQboPDYXyBMTanwzuVJtqxunenvbM7mnlUtaxXrdbxSOgddUuaIzdu3Lg9MxAgQIAAgSUF7llyepMTIECAAIG5gABxIBAgQIBAl4AA6WJTiQABAgQEiGOAAAECBLoEBEgXm0oECBAgIEAcAwQIECDQJSBAuthUIkCAAAEB4hggQIAAgS4BAdLFphIBAgQICBDHAAECBAh0CQiQLjaVCBAgQECAOAYIECBAoEtAgHSxqUSAAAECAsQxQIAAAQJdAgKki00lAgQIEBAgjgECBAgQ6BIQIF1sKhEgQICAAHEMECBAgECXgADpYlOJAAECBASIY4AAAQIEugQESBebSgQIECAgQBwDBAgQINAlIEC62FQiQIAAAQHiGCBAgACBLgEB0sWmEgECBAgIEMcAAQIECHQJCJAuNpUIECBAQIA4BggQIECgS0CAdLGpRIAAAQICxDFAgAABAl0CAqSLTSUCBAgQECCOAQIECBDoEhAgXWwqESBAgIAAcQwQIECAQJeAAOliU4kAAQIEBIhjgAABAgS6BARIF5tKBAgQICBAHAMECBAg0CUgQLrYVCJAgAABAeIYIECAAIEuAQHSxaYSAQIECAgQxwABAgQIdAkIkC42lQgQIEBAgDgGCBAgQKBLQIB0salEgAABAgLEMUCAAAECXQICpItNJQIECBAQII4BAgQIEOgSECBdbCoRIECAgABxDBAgQIBAl4AA6WJTiQABAgQEiGOAAAECBLoEBEgXm0oECBAgIEAcAwQIECDQJSBAuthUIkCAAAEB4hggQIAAgS4BAdLFphIBAgQICBDHAAECBAh0CQiQLjaVCBAgQECAOAYIECBAoEtAgHSxqUSAAAECAsQxQIAAAQJdAgKki00lAgQIEBAgjgECBAgQ6BIQIF1sKhEgQICAAHEMECBAgECXgADpYlOJAAECBASIY4AAAQIEugQESBebSgQIECAgQBwDBAgQINAlIEC62FQiQIAAAQHiGCBAgACBLgEB0sWmEgECBAgIEMcAAQIECHQJCJAuNpUIECBAQIA4BggQIECgS0CAdLGpRIAAAQICxDFAgAABAl0CAqSLTSUCBAgQECCOAQIECBDoEhAgXWwqESBAgIAAcQwQIECAQJeAAOliU4kAAQIEBIhjgAABAgS6BARIF5tKBAgQICBAHAMECBAg0CUgQLrYVCJAgAABAeIYIECAAIEuAQHSxaYSAQIECAgQxwABAgQIdAkIkC42lQgQIEBAgDgGCBAgQKBLQIB0salEgAABAgLEMUCAAAECXQICpItNJQIECBAQII4BAgQIEOgSECBdbCoRIECAgABxDBAgQIBAl4AA6WJTiQABAgQEiGOAAAECBLoEBEgXm0oECBAgIEAcAwQIECDQJSBAuthUIkCAAAEB4hggQIAAgS4BAdLFphIBAgQICBDHAAECBAh0CQiQLjaVCBAgQECAOAYIECBAoEtAgHSxqUSAAAECAsQxQIAAAQJdAgKki00lAgQIEBAgjgECBAgQ6BIQIF1sKhEgQICAAHEMECBAgECXgADpYlOJAAECBASIY4AAAQIEugQESBebSgQIECAgQBwDBAgQINAlIEC62FQiQIAAAQHiGCBAgACBLgEB0sWmEgECBAgIEMcAAQIECHQJCJAuNpUIECBAQIA4BggQIECgS0CAdLGpRIAAAQICxDFAgAABAl0CAqSLTSUCBAgQECCOAQIECBDoEhAgXWwqESBAgIAAcQwQIECAQJeAAOliU4kAAQIEBIhjgAABAgS6BARIF5tKBAgQICBAHAMECBAg0CUgQLrYVCJAgAABAeIYIECAAIEuAQHSxaYSAQIECAgQxwABAgQIdAkIkC42lQgQIEBAgDgGCBAgQKBLQIB0salEgAABAvchIDAFge+++2527dq12fXr12c3btyY3b59ewqrved1PHLkyOzYsWOzRx99dHb8+PHZvffeu+e6JiRwWAJHfvifcbP+TzwsSctdmcDFixdnFy5cmN26dWtly1inGR89enR26tSp2YkTJ9ZptawLgTsEBMgdJEasi0CuOs6fPz/7+OOP12WVDnQ9Tp48OTtz5oyrkQNVt7BlBPSBLKNl2gMTSBPVNodHoBOcMdi05roDO4gsaOUC+kBWTmwBPQKXLl1qXnmkz2CThlpIJETSL/LMM89s0ubalg0RECAbsiM3aTPSdJU+j7Hh6aefnj311FOz+++/f6x4suO++eab2eXLl2cJzsUhFk8++aSmrEUYfx+6gAA59F1gBRYF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WkAfyEGLW96uArm7Kt+zka+mLUP6AN55553593bkHVeb9gr1vNMrwTH2bEssFu84Ky5+EzhMgSM/fPfB/7/o4DDXxLIJDARyIn3jjTcGY3b+c9Pec9XqJM8r6fO9IwYC6ybgCmTd9oj1mQvkKuPkyZPVZqvWCXeTCGPgrcKbtEc3a1v0gWzW/tyYrckVRr6GNifQbR2y7THYtKutbd2fm7jdmrA2ca9u2DZdvHhxduHChR19Ihu2iTs2J30ep06dmp04cWLHeH8QWDcBAbJue8T6jArkYcF87/n169fn31m+aU1YucrI97LnVSy548pzH6OHgZFrJiBA1myHWB0CBAhMRUAfyFT2lPUkQIDAmgkIkDXbIVaHAAECUxEQIFPZU9aTAAECayYgQNZsh1gdAgQITEVAgExlT1lPAgQIrJmAAFmzHWJ1CBAgMBUBATKVPWU9CRAgsGYCAmTNdojVIUCAwFQEBMhU9pT1JECAwJoJCJA12yFWhwABAlMRECBT2VPWkwABAmsmIEDWbIdYHQIECExFQIBMZU9ZTwIECKyZgABZsx1idQgQIDAVAQEylT1lPQkQILBmAgJkzXaI1SFAgMBUBATIVPaU9SRAgMCaCQiQNdshVocAAQJTERAgU9lT1pMAAQJrJiBA1myHWB0CBAhMRUCATGVPWU8CBAismYAAWbMdYnUIECAwFQEBMpU9ZT0JECCwZgICZM12iNUhQIDAVAQEyFT2lPUkQIDAmgkIkDXbIVaHAAECUxEQIFPZU9aTAAECayYgQNZsh1gdAgQITEVAgExlT1lPAgQIrJmAAFmzHWJ1CBAgMBUBATKVPWU9CRAgsGYCAmTNdojVIUCAwFQEBMhU9pT1JECAwJoJCJA12yFWhwABAlMRECBT2VPWkwABAmsmcN+arY/VIbBnge+//3729ddfz6c/evTonutlwtu3b89u3rw5r/Pwww8vVfduJ86y83PPPfXPb1999dXsu+++mz3wwAOz++7b//9Nv/3229lnn30235THH398Jcu4Wyf1119g/4/M9d9ma1gRyEntyy+/rJTuz+hjx45VZ3TlypXZpUuX5ifNF198sTpdKbh+/frstddem//5u9/9bqmT4K1bt2Z//etf53V///vfl1keyO+33npr9umnn85++tOfzk6cODG6zLfffnt27dq1HdNcvXp19sQT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m98EagICpCazxeNzMtzP76DIp+WxK5qc/Eo7fz5tr3IoTVL5JF+a3DIufTtpRss6JlTyaX7suYic1BOstVtZY5ZpejveE0wJnKxH7BdDKvPN+PSZlFeLZJnlaf9V2pk3gZrAkR8+ld2uFRq/XQI5keYrVHOy2s8TU06877///hxz8W6hXBWkvNZktNseSLNPXhWSYXg761i9bFumWVUz2dgya+OyzrnhIGE1vHrJPtht/XIlkuayPCy427S15af5Lk16GdLPohmsJmV8S0CAtHSUESBAgEBV4J5qiQICBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQECANHEUECBAgUBcQIHUbJQQIECDQEBAgDRxFBAgQIFAXECB1GyUECBAg0BAQIA0cRQQIECBQFxAgdRslBAgQINAQ+C/MRC6OFuXcTAAAAABJRU5ErkJggg==';