import React from 'react';
import { Component } from 'react';
import WebView3 from '@/components/WebView3';
import RCTCrossWalkWebView from '@/components/RCTCrossWalkWebView';
import { View } from 'react-native';

export default class TestXwalk extends Component {
  wv:RCTCrossWalkWebView|null = null;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RCTCrossWalkWebView
          ref={wv=>this.wv=wv}
          style={{ flex: 1 }}
          onMessage={console.warn}
          source={{
            html: `
      <div>fuck!!!</div>
      <div id="log" ></div>  
      <div id="msg" ></div>  
      <script> 
        window.addEventListener('message', (e)=>{
          alert(e)
          document.getElementById('msg').innerText = JSON.stringify(e);            
        }); 
        window.addEventListener('message',(ev) => {
          alert(ev);
        })

        try{
        setTimeout(()=>{
          // alert(window.postMessage);
          window.postMessage("fuck")
          let log = ''; 
          for (let key in window.__REACT_CROSSWALK_VIEW_BRIDGE){
            log += key+'\\n'
          }
          __REACT_CROSSWALK_VIEW_BRIDGE.postMessage("fuck"); 
          document.getElementById('log').innerText = log;            
        }, 2000);

        setTimeout(()=>{
          window.postMessage("fuck") 
        }, 4000)
      }catch(err){
        alert(err)
      }
      </script>
      
      `
          }}
        />
      </View>
    );
  }

  componentDidMount(){
    setTimeout(() => {
      this.wv!.postMessage("fuck!!!!!!!!!!")
    }, 3000);
  }
}

const o: Object = {};
