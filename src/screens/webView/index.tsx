import React, {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import {Dimensions} from 'react-native';
import {PMEvent} from '../../components';
import {EmbedContext} from '../../context/embed';
import {showToast} from '../../utils/toast';

const {width, height} = Dimensions.get('screen');

export const WebViewScreen = () => {
  const {
    state: {url, saving},
  } = useContext(EmbedContext);

  const [showMessage, setShowMessage] = useState<any>(null);

  const handleMessage = (message: any) => {
    setShowMessage(JSON.parse(message.nativeEvent.data));
  };

  const handleClose = () => setShowMessage(null);

  const handleError = () => {
    showToast({
      type: 'error',
      title: 'Ocurrio un error',
      message: `no hemos podido cargar la siguiente pagina ${url}`,
    });
  };

  return (
    <View style={styles.wrapper}>
      {showMessage && (
        <PMEvent
          event={{
            title: showMessage.type,
            message: showMessage.message,
          }}
          handleClose={handleClose}
        />
      )}
      {!saving && (
        <WebView
          source={{uri: url}}
          originWhitelist={['*']}
          onMessage={handleMessage}
          onError={handleError}
          style={{
            width,
            height,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width,
    height: height - 60,
  },
});
