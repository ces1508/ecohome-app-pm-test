import React, {useContext, useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {PMEvent} from '../../components';
import {EmbedContext} from '../../context/embed';
import {handlerPM, showToast} from '../../utils/';
import {IPostMessageEvent} from '../../models/';

export const WebViewScreen = () => {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<IPostMessageEvent | null>(
    null,
  );
  const webViewRef = useRef<WebView>(null);

  const {
    state: {url, saving},
  } = useContext(EmbedContext);

  const handleMessage = (message: any) => {
    const postMesageData = JSON.parse(message.nativeEvent.data);
    setShowMessage(postMesageData);
    handlerPM({
      postMessage: postMesageData,
      webViewInstance: webViewRef,
    });
  };

  const handleClose = () => setShowMessage(null);

  const handleRefreshPage = () => {
    if (webViewRef.current && !refreshing) {
      webViewRef.current.reload();
      setRefreshing(false);
    }
  };

  const handleBack = () => {
    let backWebView = false;
    if (webViewRef.current) {
      webViewRef.current.goBack();
      backWebView = true;
    }
    return backWebView;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
  }, []);

  const handleError = () => {
    showToast({
      type: 'error',
      title: 'Ocurrio un error',
      message: `no hemos podido cargar la siguiente pagina ${url}`,
    });
  };

  const runFirst = `
    document.addEventListener('message', function (event) {
      window.postMessage(event.data, '*');
    });
    true; // note: this is required, or you'll sometimes get silent failures
  `;

  return (
    <ScrollView
      style={styles.wrapper}
      onLayout={e => setViewportHeight(e.nativeEvent.layout.height)}
      refreshControl={
        <RefreshControl
          enabled={!refreshing}
          refreshing={refreshing}
          onRefresh={handleRefreshPage}
        />
      }>
      {showMessage && (
        <PMEvent
          event={{
            title: showMessage?.fn ?? 'type no set',
            message: showMessage?.message ?? 'message no set',
          }}
          handleClose={handleClose}
        />
      )}
      {!saving && (
        <WebView
          ref={webViewRef}
          pullToRefreshEnabled={false}
          source={{
            uri: 'https://qa.ciencuadras.com/arriendo?token_id=a6fac615ca534b9abe68fa9d869df502&token_pm=987ewqdfhjktr7654q3243&channel=AL002',
          }}
          onMessage={handleMessage}
          onError={handleError}
          mixedContentMode="compatibility"
          allowsBackForwardNavigationGestures={true}
          setSupportMultipleWindows={false}
          injectedJavaScript={runFirst}
          style={{
            flex: 1,
            width: '100%',
            height: viewportHeight,
          }}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
});
