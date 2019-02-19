package com.moshi;

import android.app.Application;
import android.util.AttributeSet;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.jordansexton.react.crosswalk.webview.CrosswalkWebViewPackage;

import org.xwalk.core.XWalkView;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNFSPackage(),
                    new RNCWebViewPackage(),
                    new RNFetchBlobPackage(),
                    new VectorIconsPackage(),
                    new CrosswalkWebViewPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        // #xwalk 
        // new XWalkView(this ).onDestroy();  // just add this line for RN dev mode,and release mode you can delete it
        // /xwalk
    }
}
