import React from 'react';
import { TouchableWithoutFeedbackProps } from 'react-native';
import { RippleFeedback } from 'react-native-material-ui';

export default function Touchable(
  props: TouchableWithoutFeedbackProps & {
    color?: string;
    borderless?: boolean;
    children: JSX.Element;
  }
) {
  return <RippleFeedback {...props} />;
}
