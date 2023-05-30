import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {ThemeContext} from '../../context/theme';
import {EmbedContext} from '../../context/embed';
import {isValidUrl} from '../../utils/isValidUrl';

export const OptionsScreen = ({navigation}: {navigation: any}) => {
  const {background, color} = useContext(ThemeContext);
  const {state, saveUrl} = useContext(EmbedContext);
  const [inputValue, setInput] = useState(state.url);

  function setNewUrl(newUrl: string) {
    if (isValidUrl(newUrl)) saveUrl(newUrl);
  }

  useEffect(() => {
    navigation.navigate('home');
  }, [state.url]);
  return (
    <View style={[styles.wrapper, {backgroundColor: background}]}>
      <Text style={{color}}>Url del sitio a embeber</Text>
      <TextInput
        placeholderTextColor={background}
        value={inputValue}
        onChangeText={text => setInput(text)}
        style={[styles.input, {color: background}]}
        placeholder="Ingresa una url"
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setNewUrl(inputValue)}>
        <Text>{state.saving ? 'Guardando' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'pink',
    height: '100%',
    gap: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d4d4d4',
    borderRadius: 8,
    backgroundColor: '#d4d4d4',
    width: '100%',
    paddingHorizontal: 10,
  },
  btn: {
    width: '85%',
    height: 50,
    backgroundColor: 'blue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
