import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

export interface IPropsData {
  event: {
    title: string;
    message: any;
  };
  handleClose: () => void;
}

export const PMEvent = ({event, handleClose}: IPropsData) => {
  const [show, setShow] = useState(false);
  const {title, message} = event;
  const showMessage = 'Ver Datos del evento';
  const closeMessage = 'Ver menos datos del evento';

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.title, styles.centerText]}>Nuevo PM recibido</Text>
      <Text style={[styles.pmTitle, styles.centerText]}>{title}</Text>
      <Button
        color="#006098"
        onPress={() => setShow(val => !val)}
        title={show ? closeMessage : showMessage}
      />
      <View style={{display: show ? 'flex' : 'none'}}>
        <Text style={styles.centerText}>
          {JSON.stringify(message, null, 2)}
        </Text>
      </View>
      <Button color="#006098" onPress={handleClose} title="Cerrar" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  button: {
    borderRadius: 8,
  },
  centerText: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 20,
    paddingVertical: 10,
  },
  pmTitle: {
    color: 'red',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
