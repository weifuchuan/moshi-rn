import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SCREEN_WIDTH } from '@/kit';

export default function Separator({ style }: { style?: ViewStyle }) {
  return (
    <View style={[ { height: 8, width: SCREEN_WIDTH, opacity: 0 }, style ]} />
  );
}
