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
          onMessage={(e) => console.warn(e)}
          source={{
            html: `
      <div>fuck!!!!</div>
      <div id="log" ></div>  
      <div id="msg" ></div>   
      <button id="resp" >resp</button>
      
      <script> 
        // alert('fuck'); 
        setTimeout(()=>{
          try{
            let log='window:\\n';
            for(let key in window){
              log += key+"\\n"
            }
            document.getElementById('log').innerText = log; 
          }catch(err){alert(err)}

          document.getElementById('resp').onclick = ()=>{
            try{
              __REACT_CROSSWALK_VIEW_BRIDGE.postMessage("resp fuck"); 
              window.postMessage("resp fuck"); 
            }catch(err){alert(err)}
          }
        }, 1000)

        window.document.addEventListener('message', e => {
          alert(e.data); 
        });
      </script>
      
      `
          }}
        />
      </View>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      // this.wv!.postMessage('fuck!!!!!!!!!!');
    }, 3000);
  }
}

const o: Object = {};
