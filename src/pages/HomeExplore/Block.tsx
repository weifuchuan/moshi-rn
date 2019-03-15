import { FunctionComponent, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { View, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native';

interface Props {
  leftTitle: string;
  rightTitle: string;
  body: ReactNode;
  onRightTitlePress: () => void;
}

const Block: FunctionComponent<
  Props
> = observer(({ leftTitle, rightTitle, body, onRightTitlePress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.leftTitle}>{leftTitle}</Text>
        <Text style={styles.rightTitle} onPress={onRightTitlePress}>
          {rightTitle}
        </Text>
      </View>
      <View style={styles.body}>{body}</View>
    </View>
  );
});

export default Block;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: '#fff'
  } as ViewStyle,
  title: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  leftTitle: {
    borderLeftWidth: 4,
    borderLeftColor: colors.Tomato,
    fontSize: 18,
    paddingLeft: 12,
    color: '#000'
  } as TextStyle,
  rightTitle: {
    fontSize: 14
  } as TextStyle,
  body: {
    paddingTop: 16
  } as ViewStyle
});
