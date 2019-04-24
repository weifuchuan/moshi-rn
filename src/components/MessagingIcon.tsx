import { Badge } from '@ant-design/react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Touchable from './Touchable';
import Routes from '@/Routes';
import { observer } from 'mobx-react-lite';

export default observer(function MessagingIcon() {
  return (
    <Touchable
      onPress={() => {
        Routes.communication();
      }}
    >
      <Badge text={9} dot>
        <MaterialCommunityIcons name="bell" size={22} />
      </Badge>
    </Touchable>
  );
});
