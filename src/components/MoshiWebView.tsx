import React from 'react';
import { WebView, WebViewProps } from 'react-native-webview';
import { NativeSyntheticEvent } from 'react-native';
import { SCREEN_HEIGHT } from '@/kit';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes';

export interface AnyAction {
  action: string;
  payload: any;
}

export interface MoshiWebViewProps extends WebViewProps {
  on?: (payload: any) => Promise<any>;
  wvRef?: (instance: WebView | null) => void;
  minBodyHeight?: string;
  notAutoHeight?: boolean;
}

export default class MoshiWebView extends React.Component<MoshiWebViewProps> {
  static defaultProps = {
    on: () => Promise.resolve()
  };

  state = {
    height: SCREEN_HEIGHT
  };

  private ready = false;
  private pending: Function[] = [];

  private runPending = () => {
    this.pending.forEach((f) => f());
    this.pending = [];
  };

  private id2resolve = new Map<string, (value?: any) => void>();
  readonly post: <T = any>(data: T) => Promise<any> = (data) => {
    if (!this.ready) {
      return new Promise((resolve) => {
        this.pending.push(async () => {
          resolve(await this.post(data));
        });
      });
    }
    return new Promise((resolve) => {
      if (this._webview) {
        const id = new Date().toString() + Math.random();
        this.id2resolve.set(id, resolve);
        this.postMessage(
          JSON.stringify({
            id,
            payload: data,
            type: 0 /* from parent to webview */
          })
        );
      }
    });
  };
  private _webview: WebView | null = null;
  get webview(): WebView {
    return this._webview!;
  }
  private onMessage = async (event: NativeSyntheticEvent<WebViewMessage>) => {
    if (event.nativeEvent.data.trim() === 'ready') {
      this.ready = true;
      this.postMessage('ready');
      this.props.minBodyHeight &&
        this.postMessage(
          JSON.stringify({
            action: 'minBodyHeight',
            payload: this.props.minBodyHeight
          })
        );
      this.runPending();
      return;
    }
    const msg = JSON.parse(event.nativeEvent.data);
    if (msg.type === 0) {
      const { id, result } = msg;
      if (this.id2resolve.has(id)) {
        this.id2resolve.get(id)!(result);
        this.id2resolve.delete(id);
      }
    } else if (msg.type === 1) {
      const { id, payload } = msg;
      if (!this.props.on) return;
      const result = await this.props.on!(payload);
      result &&
        this.postMessage(
          JSON.stringify({ id, result, type: 1 /* from webview to parent */ })
        );
    } else if (msg.type === 'heightChange') {
      // console.warn(''+msg.height)
      // msg.height && this.setState({ height: msg.height });
      msg.height && this.setHeight$.next(msg.height);
    }
  };

  private setHeight$ = new Subject<number>();

  render() {
    return (
      <WebView
        {...this.props}
        useWebKit={true}
        startInLoadingState={true}
        mixedContentMode={'always'}
        {...{ thirdPartyCookiesEnabled: true }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        ref={(w) => (
          (this._webview = w), this.props.wvRef && this.props.wvRef(w)
        )}
        onMessage={this.onMessage}
        style={[
          this.props.style,
          { height: !this.props.notAutoHeight ? this.state.height : '100%' }
        ]}
        allowsInlineMediaPlayback={true}
        dataDetectorTypes={'all'}
        geolocationEnabled={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccess={true}
        cacheEnabled={true}
      />
    );
  }

  componentDidMount() {
    this.setHeight$.pipe(debounceTime(100)).subscribe((height) => {
      this.setState({ height });
    });
  }

  componentWillUnmount() {
    this.setHeight$.unsubscribe();
  }

  postMessage = (data: string) => {
    this._webview!.injectJavaScript(
      `window.document.dispatchEvent(new MessageEvent("message", {data:${JSON.stringify(
        data
      )}}))`
    );
  };
}
