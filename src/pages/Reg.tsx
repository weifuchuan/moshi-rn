import useCaptcha from '@/hooks/useCaptcha';
import { SCREEN_WIDTH } from '@/kit';
import Routes from '@/Routes';
import ThemeContext from '@/themes';
import { observer } from 'mobx-react-lite';
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useReducer
} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import { Button } from 'react-native-elements';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Account from '@/models/Account';
import { StoreContext } from '@/store';
import { Toast, Modal } from '@ant-design/react-native';
const { Input } = require('react-native-elements');

interface Props {}

const Reg: FunctionComponent<Props> = () => {
  const [ form, dispatch ] = useRegForm();
  const [ captcha, updateCaptcha ] = useCaptcha('/reg/captcha');
  const theme = useContext(ThemeContext);
  const store = useContext(StoreContext);
  const onReg = useCallback(
    async () => {
      try {
        const account = await Account.reg(
          form.email,
          form.nickName,
          form.password,
          form.captcha
        );
        store.me = account;
        Modal.alert('注册成功！', '请尽快到邮箱激活账号');
        Routes.pop(); 
      } catch (err) {
        console.warn(err);
        Toast.fail(err.toString());
        updateCaptcha();
        dispatch({ type: 'captcha', payload: '' });
      }
    },
    [ form ]
  );

  return (
    <View
      style={[ styles.container, { backgroundColor: theme.colors.BACKGROUND } ]}
    >
      <Text style={styles.logo}>默识</Text>
      <Input
        value={form.email}
        onChangeText={(text: string) =>
          dispatch({ type: 'email', payload: text })}
        placeholder="邮箱"
        inputStyle={{ fontSize: 16 } as TextStyle}
        leftIcon={
          <IconMaterialCommunityIcons name="email" size={24} color="black" />
        }
        containerStyle={{ marginTop: 20 }}
        textContentType={'emailAddress'}
        keyboardType={'email-address'}
      />
      <Input
        value={form.nickName}
        onChangeText={(text: string) =>
          dispatch({ type: 'nickName', payload: text })}
        placeholder="昵称"
        inputStyle={{ fontSize: 16 } as TextStyle}
        leftIcon={
          <IconMaterialCommunityIcons name="account" size={24} color="black" />
        }
        containerStyle={{ marginTop: 20 }}
      />
      <Input
        value={form.password}
        onChangeText={(text: string) =>
          dispatch({ type: 'password', payload: text })}
        secureTextEntry={true}
        placeholder="密码"
        inputStyle={{ fontSize: 16 } as TextStyle}
        leftIcon={
          <IconMaterialCommunityIcons name="lock" size={24} color="black" />
        }
        containerStyle={{ marginTop: 20 }}
        textContentType={'password'}
      />
      <Input
        value={form.captcha}
        onChangeText={(text: string) =>
          dispatch({ type: 'captcha', payload: text })}
        placeholder="验证码"
        inputStyle={{ fontSize: 16 } as TextStyle}
        leftIcon={
          <IconMaterialCommunityIcons name="security" size={24} color="black" />
        }
        rightIcon={
          <TouchableOpacity onPress={updateCaptcha}>
            <Image
              source={{ uri: captcha }}
              style={{ width: 95, height: 31 }}
            />
          </TouchableOpacity>
        }
        containerStyle={{ marginTop: 20 }}
        textContentType={'password'}
      />
      <Button
        title={'注册'}
        loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
        titleStyle={{ fontWeight: '700' }}
        buttonStyle={{
          backgroundColor: 'rgba(92, 99,216, 1)',
          width: SCREEN_WIDTH * 0.9,
          height: 45,
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 5
        }}
        containerStyle={{ marginTop: 20 }}
        onPress={onReg}
      />
      <TouchableOpacity onPress={() => Routes.pop()} style={styles.back}>
        <IconMaterialIcons name="arrow-back" size={30} color="#3a5795" />
      </TouchableOpacity>
      <Text style={styles.reg} onPress={() => Routes.login()}>
        登录
      </Text>
    </View>
  );
};

export default observer(Reg);

const useRegForm = () => {
  return useReducer(
    (
      form,
      action: {
        type: 'email' | 'password' | 'captcha' | 'nickName';
        payload: any;
      }
    ) => {
      switch (action.type) {
        case 'email':
          return { ...form, email: action.payload };
        case 'nickName':
          return { ...form, nickName: action.payload };
        case 'password':
          return { ...form, password: action.payload };
        case 'captcha':
          return { ...form, captcha: action.payload };
        default:
          break;
      }
      return form;
    },
    {
      email: '',
      nickName: '',
      password: '',
      captcha: ''
    }
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  } as ViewStyle,
  logo: {
    fontSize: 48,
    color: '#3a5795'
    // marginTop: SCREEN_HEIGHT * 0.15
  } as TextStyle,
  forgetPassword: {
    marginTop: 20,
    alignSelf: 'flex-end',
    marginRight: SCREEN_WIDTH * 0.05
  } as TextStyle,
  back: {
    position: 'absolute',
    top: SCREEN_WIDTH * 0.05,
    left: SCREEN_WIDTH * 0.05
  } as ViewStyle,
  reg: {
    fontSize: 20,
    color: '#3a5795',
    position: 'absolute',
    top: SCREEN_WIDTH * 0.05,
    right: SCREEN_WIDTH * 0.05
  } as TextStyle
});
