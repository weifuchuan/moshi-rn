import { IArticle } from '@/models/Article';
import React from 'react';
import { View, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Touchable from '@/components/Touchable';

interface Props {
  newses: IArticle[];
  onNewsPress: (news: IArticle) => void;
}

export default function NewsList({ newses, onNewsPress }: Props) {
  const renderItem: (
    value: IArticle,
    index: number,
    array: IArticle[]
  ) => JSX.Element = (news) => {
    return (
      <Touchable key={news.id} onPress={() => onNewsPress(news)}>
        <View style={styles.item}>
          <Entypo name={'news'} size={16} />
          <Text style={styles.title}>{news.title}</Text>
        </View>
      </Touchable>
    );
  };

  return <View style={styles.container}>{newses.map(renderItem)}</View>;
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 4
  } as ViewStyle,
  item: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center'
  } as ViewStyle,
  title: {
    fontSize: 16,
    paddingLeft: 4
  } as TextStyle
});
