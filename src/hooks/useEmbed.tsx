import {useEffect, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IEmbedData, IEmbedDataState} from '../models/embed.model';
import {showToast as SendNotification} from '../utils/toast';

const EMBEB_TOKEN = '@EMBED_TOKEN';

const initialState: IEmbedDataState = {
  url: 'https://qa.ciencuadras.com',
  saving: false,
};
const reducerObject = {
  save: (state: IEmbedDataState, action: {key: string; url: string}) => ({
    ...state,
    url: action.url,
    saving: false,
  }),
  saving: (state: IEmbedDataState) => ({...state, saving: true}),
};
function reducer(
  state: IEmbedDataState,
  action: {key: 'save' | 'saving'; url: string},
) {
  if (Object.prototype.hasOwnProperty.call(reducerObject, action.key))
    return reducerObject[action.key](state, action);

  return initialState;
}
export function useEmbed(): IEmbedData {
  const [state, dispatch] = useReducer(reducer, initialState);

  function showLoading() {
    dispatch({key: 'saving', url: ''});
  }
  async function saveUrl(url: string, showToast = true) {
    showLoading();
    await AsyncStorage.setItem(EMBEB_TOKEN, addProtocol(url));
    dispatch({key: 'save', url: addProtocol(url)});
    if (showToast)
      SendNotification({
        type: 'success',
        title: 'Guardado',
        message: 'Se ha guardado el nuevo sitio satisfactoriamente',
      });
  }

  async function setInitialUrl() {
    showLoading();
    const url = await AsyncStorage.getItem(EMBEB_TOKEN);
    saveUrl(url ?? initialState.url, false);
  }

  // write a fun
  function addProtocol(url: string) {
    const formatUrl = url.trim().split('://');
    if (formatUrl.length > 1) return url;
    return `https://${url}`;
  }

  return {
    state,
    saveUrl,
    setInitialData: setInitialUrl,
  };
}
