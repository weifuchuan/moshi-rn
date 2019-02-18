import React, { useRef, useEffect } from 'react';
import WebView2 from './WebView2';
import markdownToHtml from '@/kit/functions/markdownToHtml';
import { WebViewProps } from 'react-native';
import rawHtml from './content.html.raw'

interface Props extends WebViewProps {
  content: string;
  type: 'html' | 'md';
}

export default function ContentPanel({ content, type, ...otherProps }: Props) {
  const webView = useRef<WebView2>(null);

  useEffect(
    () => {
      (async () => {
        let html = '';
        let type = 'geektime';
        if (type === 'md') {
          html = await markdownToHtml(content);
          type = 'github';
        } else {
          html = content;
        }
        webView.current!.post({ content: html, type });
      })();
    },
    [ content, type ]
  );

  return (
    <WebView2
      {...otherProps}
      ref={webView}
      on={async (payload) => {
        if (payload.action === 'click') {
          const uri: string = payload.uri;
        }
      }}
      source={
        { html: rawHtml, baseUrl: '' }
      // { uri: 'http://192.168.1.18:3001/content.html' }
      }
    />
  );
}
 