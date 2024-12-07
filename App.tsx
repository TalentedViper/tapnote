import React, {useEffect} from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from 'react-native-splash-screen';


import {colors} from './src/styles';


const App: React.FC = () => {

  useEffect(() => {
    SplashScreen.hide(); // Hide the splash screen once the app is ready
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.background}
          />
          <AppNavigator />
          <Toast />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
