/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {WebViewScreen, OptionsScreen} from './src/screens';
import {ThemeContext} from './src/context/theme';
import {useOwnTheme} from './src/hooks/useOwnTheme';
import {EmbedContext} from './src/context/embed';
import {useEmbed} from './src/hooks/useEmbed';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  const theme = useOwnTheme();
  const {saveUrl, state, setInitialData} = useEmbed();

  useEffect(() => {
    setInitialData();
  }, []);

  return (
    <>
      <ThemeContext.Provider value={{...theme}}>
        <EmbedContext.Provider value={{state, saveUrl, setInitialData}}>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen
                name="home"
                options={{
                  headerShown: false,
                  tabBarLabel: 'Home',
                  tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons
                      name="home"
                      color={color}
                      size={size}
                    />
                  ),
                }}
                component={WebViewScreen}
              />
              <Tab.Screen
                name="options"
                component={OptionsScreen}
                options={{
                  headerTitle: 'Configuracion',
                  tabBarLabel: 'Configuracion',
                  tabBarIcon: ({color, size}) => (
                    <MaterialCommunityIcons
                      name="cog-outline"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </EmbedContext.Provider>
      </ThemeContext.Provider>
      <Toast />
    </>
  );
}

export default App;
