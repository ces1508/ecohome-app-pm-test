import Toast from 'react-native-toast-message';
import {ITastPayload} from '../models/toast.model';

export function showToast({type, title, message}: ITastPayload): void {
  Toast.show({
    type,
    text1: title,
    text2: message,
  });
}
