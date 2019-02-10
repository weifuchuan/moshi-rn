import React from 'react';

import { ViewStyle, TextStyle } from 'react-native';

export interface Props {
  renderers?: {
    [tag: string]: (...params: any[]) => React.ReactNode;
  };
  renderersProps?: any;
  html: string;
  uri?: string;
  decodeEntities?: boolean;
  imagesMaxWidth?: number;
  staticContentMaxWidth?: number;
  imagesInitialDimensions?: { width: number; height: number };
  onLinkPress?: (
    cls: any,
    href: string,
    attrs: { [name: string]: string }
  ) => void;
  onParsed?: (dom: any, RNElements: any) => void;
  tagsStyles?: {
    [tag: string]: any;
  };
  classesStyles?: {
    [className: string]: any;
  };
  listsPrefixesRenderers?: {
    [tag: string]: (
      htmlAttribs: any,
      children: any,
      convertedCSSStyles: any,
      passProps: any
    ) => React.ReactNode;
  };
  containerStyle?: ViewStyle;
  customWrapper?: Function;
  remoteLoadingView?: Function;
  remoteErrorView?: Function;
  emSize?: number;
  ptSize?: number;
  baseFontStyle?: TextStyle;
  textSelectable?: boolean;
  alterData?: Function;
  alterChildren?: Function;
  alterNode?: Function;
  ignoredTags?: string[];
  allowedStyles?: any[];
  ignoredStyles?: any[];
  ignoreNodesFunction?: Function;
  debug?: boolean;
}

declare class HTMLClass extends React.Component<Props> {}

const HTMLC: typeof HTMLClass = require('react-native-render-html').default;

export default function HTML(props: Props) {
  return (
    <HTMLC
      emSize={16}
      ptSize={1.6}
      baseFontStyle={{ fontSize: 16, color: '#000' }}
      textSelectable
      tagsStyles={{
        a: { textDecorationLine: 'none' },
        strong: { color: '#c00', fontWeight: 'normal' }
      }}
      {...props}
    />
  );
}
