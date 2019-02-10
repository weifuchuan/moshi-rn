import React, { useContext } from 'react';
import { View, Text, StyleSheet, ViewStyle, Image } from 'react-native';
import {
  Drawer,
  Avatar,
  Button,
  Icon,
  ListItemProps
} from 'react-native-material-ui';
import { StoreContext } from '@/store';
import { useObserver, observer } from 'mobx-react-lite';
import Routes from '@/Routes';
import { SCREEN_WIDTH } from '@/kit';
import { FAKE_ACCOUNT } from '@/models/Account';
import Touchable from './Touchable';
import { ActionSheet } from '@ant-design/react-native';
import { SCREEN_HEIGHT } from '../kit/index';
import ThemeContext from '@/themes';
import { defaultRealPicture } from '@/models/Course';

export default observer(function HomeDrawer() {
  const store = useContext(StoreContext);
  const theme = useContext(ThemeContext);
  const me = store.me || FAKE_ACCOUNT;
  return (
    <View style={{ flex: 1 }}>
      <Drawer>
        <React.Fragment>
          <Drawer.Header>
            <Drawer.Header.Account
              avatar={
                <Avatar
                  {...(store.me
                    ? {
                        image: (
                          <Image
                            source={{
                              uri: me.avatar ? me.avatar : defaultRealPicture
                            }}
                          />
                        ) as any
                      }
                    : { icon: 'account-circle' })}
                />
              }
              footer={
                {
                  dense: true,
                  centerElement: (
                    <View style={copiedStyles.textViewContainer}>
                      <View style={copiedStyles.firstLine as any}>
                        <View style={copiedStyles.primaryTextContainer}>
                          <Text
                            numberOfLines={1}
                            style={copiedStyles.primaryText as any}
                          >
                            {me.nickName}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={copiedStyles.secondaryText as any}>
                          {me.email}
                        </Text>
                      </View>
                    </View>
                  ),
                  rightElement: 'arrow-drop-down',
                  onRightElementPress: () => {
                    ActionSheet.showActionSheetWithOptions(
                      {
                        options: [ '更换头像', '修改密码', '退出登录', '取消' ],
                        cancelButtonIndex: 3,
                        destructiveButtonIndex: 2
                      },
                      (i) => {}
                    );
                  }
                } as ListItemProps
              }
            />
          </Drawer.Header>
          <Drawer.Section
            divider
            items={[
              { icon: 'bookmark-border', value: 'Notifications' },
              { icon: 'today', value: 'Calendar', active: true },
              { icon: 'people', value: 'Clients' }
            ]}
          />
          <Drawer.Section
            title="Personal"
            items={[
              { icon: 'info', value: 'Info' },
              { icon: 'settings', value: 'Settings' }
            ]}
          />
        </React.Fragment>
      </Drawer>
      {store.me ? null : (
        <View
          style={[
            styles.unloginContainer,
            { width: theme.distances.drawerWidth }
          ]}
        >
          <View style={styles.unloggedBtns}>
            <Button
              text={'登录'}
              style={{
                container: styles.loginBtnContainer,
                text: { color: '#FFF', fontSize: 16 }
              }}
              onPress={() => {
                Routes.login();
              }}
            />
            <Button
              text={'注册'}
              style={{
                container: styles.regBtnContainer,
                text: { color: '#FFF', fontSize: 16 }
              }}
              onPress={() => {
                Routes.reg();
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  unloginContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
    zIndex: 100
  } as ViewStyle,
  unloggedBtns: {
    flexDirection: 'row'
  } as ViewStyle,
  loginBtnContainer: {
    backgroundColor: '#9370DB',
    marginRight: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16
  } as ViewStyle,
  regBtnContainer: {
    backgroundColor: '#3CB371',
    marginLeft: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16
  } as ViewStyle
});

const copiedStyles = {
  container: [
    { backgroundColor: '#ffffff', height: 56 },
    { height: 48 },
    null
  ],
  content: [ null, null ],
  contentViewContainer: [
    { flex: 1, flexDirection: 'row', alignItems: 'center' },
    { paddingRight: 16 },
    null
  ],
  leftElementContainer: [ { width: 56, marginLeft: 16 }, {}, null ],
  centerElementContainer: [ { flex: 1 }, {}, null ],
  textViewContainer: [ {}, null ],
  primaryText: [
    {
      lineHeight: 24,
      color: 'rgba(0, 0, 0, 0.87)',
      fontWeight: '400',
      fontSize: 16
    },
    { fontWeight: '500', fontSize: 14 }
  ],
  firstLine: [ { flexDirection: 'row' }, null ],
  primaryTextContainer: [ { flex: 1 }, null ],
  secondaryText: [
    {
      lineHeight: 20,
      color: 'rgba(0, 0, 0, 0.54)',
      fontWeight: '400',
      fontSize: 14
    },
    null
  ],
  tertiaryText: [
    {
      lineHeight: 20,
      color: 'rgba(0, 0, 0, 0.54)',
      fontWeight: '400',
      fontSize: 14
    },
    null
  ],
  rightElementContainer: [
    { paddingRight: 4, flexDirection: 'row', backgroundColor: 'transparent' },
    null
  ],
  leftElement: [ { margin: 16, color: 'rgba(0, 0, 0, 0.54)' }, null ],
  rightElement: [ { color: 'rgba(0, 0, 0, 0.54)' }, null ]
};
