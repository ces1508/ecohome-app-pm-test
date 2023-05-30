import {useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export function useOwnTheme() {
  const isDarkMode = useColorScheme() === 'dark';
  return {
    background: isDarkMode ? Colors.darker : Colors.lighter,
    color: isDarkMode ? '#fff' : '#000',
  };
}
