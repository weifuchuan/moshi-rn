import { SCREEN_WIDTH } from '@/kit';
import Routes from '@/routes';
import React, { useState, useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BottomNavigation } from 'react-native-material-ui';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

interface Props {
  navigation: any;
  jumpTo: (key: string) => void;
}

export default function HomeBottomNavigation({ navigation, jumpTo }: Props) {
  const [ active, setActive ] = useState('explore');
  useEffect(() => {
    const f = (active: 'explore' | 'classroom' | 'learn' | 'my') => {
      setActive(active);
    };
    bus.on('selectHomeBottomNav', f);
    return () => {
      bus.removeListener('selectHomeBottomNav', f);
    };
  }, []);
  return (
    <BottomNavigation active={active} hidden={false}>
      {navigation.state.routes
        .map((route: any) => {
          let label = '',
            icon: string | JSX.Element = '',
            onPress = () => {
              jumpTo(route.key);
            },
            addition = null,
            minWidth = SCREEN_WIDTH / 6;
          if (route.key === 'explore') {
            label = '发现';
            icon = 'explore';
          } else if (route.key === 'classroom') {
            label = '讲堂';
            icon = 'school';
          } else if (route.key === 'learn') {
						label = '学习';
            icon = <MaterialCommunityIcons name="book-open-variant" size={24} />;
          } else if (route.key === 'my') {
            label = '我的';
            icon = 'account-box';
          } 
          return [
            <BottomNavigation.Action
              key={route.key}
              icon={icon}
              label={label}
              onPress={onPress}
              active={false}
              style={{ container: { minWidth } }}
            />,
            addition
          ];
        })
        .reduce(
          (p: React.ReactNode[], n: React.ReactNode[]) => (
            p.push(...n), p.filter((e) => e != null)
          ),
          []
        )}
    </BottomNavigation>
  );
}
