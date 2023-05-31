import React, {useContext, useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  BackHandler,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {PMEvent} from '../../components';
import {EmbedContext} from '../../context/embed';
import {showToast} from '../../utils/toast';

const {height} = Dimensions.get('screen');

export const WebViewScreen = () => {
  // usar ref causa un problema en la primera vez que ingresa
  const [viewportHeight, setViewportHeight] = useState(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<any>(null);

  const webViewRef = useRef<WebView>(null);

  const {
    state: {url, saving},
  } = useContext(EmbedContext);

  const handleMessage = (message: any) => {
    setShowMessage(JSON.parse(message.nativeEvent.data));
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
            title: showMessage?.type ?? 'type no set',
            message: showMessage?.message ?? 'message no set',
          }}
          handleClose={handleClose}
        />
      )}
      {!saving && (
        <WebView
          ref={webViewRef}
          pullToRefreshEnabled={false}
          source={{uri: url}}
          onMessage={handleMessage}
          onError={handleError}
          allowsBackForwardNavigationGestures={true}
          setSupportMultipleWindows={false}
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
