import React, { useState } from 'react';
import { WebView, WebViewSharedProps } from 'react-native-webview';

export interface MyWebViewProps extends WebViewSharedProps {}

export default function MyWebView({ ...otherProps }: MyWebViewProps) {
  const [height,setHeight]=useState(0); 

  return <WebView {...otherProps} 

  />;
}
