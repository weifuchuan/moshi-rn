import React from 'react';
import { NativeSyntheticEvent, ViewStyle, StyleProp } from 'react-native';
import { WebViewMessage } from 'react-native-webview'; 

export interface RCTCrossWalkWebViewProps {
  injectedJavaScript?: string;
  localhost?: string;
  onError?: (event: any) => void;
  onMessage?: (event: NativeSyntheticEvent<WebViewMessage>) => void;
  onMsg?: (event: NativeSyntheticEvent<WebViewMessage>) => void;
  onNavigationStateChange?: (event: any) => void;
  onProgress?: (progress: number) => void;
  allowUniversalAccessFromFileURLs?: boolean;
  domStorageEnabled?: boolean;
  mediaPlaybackRequiresUserAction?: boolean;
  javaScriptEnabled?: boolean;
  userAgent?: string;
  scalesPageToFit?: boolean;
  saveFormDataDisabled?: boolean;
  source: { uri: string } | { html: string } | number;
  url?: string;
  style?: StyleProp<ViewStyle>;
}

export default class RCTCrossWalkWebView extends React.Component<RCTCrossWalkWebViewProps> {
  goBack() {}
  goForward() {}
  reload() {}
  load(url: string) {}
  postMessage(data: any) {}
} 