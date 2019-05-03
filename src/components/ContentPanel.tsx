import React, { useRef, useEffect } from 'react';
import MoshiWebView, { MoshiWebViewProps } from './MoshiWebView';
import markdownToHtml from '@/kit/functions/markdownToHtml'; 
import rawHtml from './content.html.raw'

interface Props extends MoshiWebViewProps {
  content: string;
  type: 'html' | 'md';
}

export default function ContentPanel({ content, type, ...otherProps }: Props) {
  const webView = useRef<MoshiWebView>(null);

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
    <MoshiWebView
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
      originWhitelist={[]}
    />
  );
}
 