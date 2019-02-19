import React from 'react';
import { Component } from 'react';
import WebView3 from '@/components/WebView3';
import RCTCrossWalkWebView from '@/components/RCTCrossWalkWebView';
import { View, Button, NativeModules } from 'react-native';

export default class TestXwalk extends Component {
  wv: RCTCrossWalkWebView | null = null;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button
          title="send fuck"
          onPress={() => {
            console.warn("click")
            this.wv!.postMessage('fuck');
          }}
        />
        <RCTCrossWalkWebView
          ref={(wv) => (this.wv = wv)}
          style={{ flex: 1 }}
          onMsg={(e) => console.warn(e)}
          onMessage={(e) => console.warn(e)}
          source={{
            html: `
      <div>fuck!!kk!!</div>
      <div id="log" ></div>  
      <div id="msg" ></div>  
      <button onclick="document.dispatchEvent(new MessageEvent('message', {data:'fuck'}))" >fake</button>
      <button onclick="__REACT_CROSSWALK_VIEW_BRIDGE.postMessage('fuck!!!!!!')" >resp</button>
      <script> 
        let log='';
        for(let key in __REACT_CROSSWALK_VIEW_BRIDGE){
          alert(key)
        }
      </script>
      
      `
          }}
        />
      </View>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.wv!.postMessage('fuck!!!!!!!!!!');
    }, 3000);
  }
}

const o: Object = {};
