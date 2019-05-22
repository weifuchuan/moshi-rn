import { View, Text } from 'react-native';
import React from 'react';
import Touchable from '@/components/Touchable';

export default function MultiSelector({
  options,
  selected,
  onChange
}: {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}) {
  const selectedSet = new Set<string>();
  selected.forEach((x) => selectedSet.add(x));

  return (
    <View style={{ padding: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
      {options.map((op) => (
        <Touchable
          key={op}
          onPress={() => {
            if (selectedSet.has(op)) {
              onChange([ ...selected.filter((x) => x !== op) ]);
            } else {
              onChange([ ...selected, op ]);
            }
          }}
        >
          <View
            style={{
              margin:4, 
              padding: 8,
              borderRadius: 4,
              borderColor: colors.浅石板灰,
              borderWidth: 1,
              backgroundColor: selectedSet.has(op) ? colors.番茄 : colors.白烟
            }}
          >
            <Text
              style={{
                color: selectedSet.has(op) ? colors.白烟 : colors.Black,
                fontSize: 16
              }}
            >
              {op}
            </Text>
          </View>
        </Touchable>
      ))}
    </View>
  );
}
