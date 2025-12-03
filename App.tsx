import React, { useState, useEffect } from 'react';
import { ImageBackground, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './assets/screens/Login';
import RegisterScreen from './assets/screens/Register';
import Register2Screen from './assets/screens/Register2';
import HomeScreen from './assets/screens/Home';
import NewGameScreen from './assets/screens/NewGame';
import ForgotPasswordScreen from './assets/screens/ForgotPassword';
import ProfileScreen from './assets/screens/Profile';
import HistoryScreen from './assets/screens/History';
import Map from './assets/screens/Map';

import { globalStyles } from './assets/components/globalStyles';
import * as Font from 'expo-font';

import Toast, { BaseToast, ToastConfig } from 'react-native-toast-message';
import { Colors } from 'react-native/Libraries/NewAppScreen';

// ----------------------------------------------------------
// ROOT STACK TYPED (CORREGIDO)
// ----------------------------------------------------------
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Register2: { email: string; password: string; username: string } | undefined;
  ForgotPassword: undefined;
  NewGame: undefined;
  Profile: undefined;
  History: undefined;
  Map: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ----------------------------------------------------------
// TOAST CONFIG
// ----------------------------------------------------------
const toastConfig: ToastConfig = {
  error: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#FB6600', height: 100 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '700', color: Colors.gris, fontFamily: 'Michroma' }}
      text2Style={{ fontSize: 14, color: Colors.gris, fontFamily: 'Michroma' }}
    />
  ),
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#00FF00', height: 100 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: '700', color: Colors.gris, fontFamily: 'Michroma' }}
      text2Style={{ fontSize: 14, color: Colors.gris, fontFamily: 'Michroma' }}
    />
  ),
};

// ----------------------------------------------------------
// APP
// ----------------------------------------------------------
export default function App() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      await Font.loadAsync({
        Michroma: require('./assets/fonts/Michroma-Regular.ttf'),
      });

      let progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 1) {
            clearInterval(progressInterval);
            setIsLoading(false);
            return 1;
          }
          return prevProgress + 0.1;
        });
      }, 500);
    };

    loadResources();
  }, []);

  if (isLoading) {
    return (
      <ImageBackground
        source={require('./assets/images/Airsoft_BW.png')}
        style={globalStyles.backgroundSplash}
      >
        <View style={globalStyles.loadingContainerSplash}>
          <Progress.Bar
            progress={progress}
            width={340}
            color="#FB6600"
            borderColor="#FFFF"
          />
        </View>

        <View style={globalStyles.logoContainerSplash}>
          <ImageBackground
            source={require('./assets/images/logo.png')}
            style={globalStyles.logoSplash}
          />
        </View>
      </ImageBackground>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Register2" component={Register2Screen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="NewGame" component={NewGameScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="Map" component={Map} />
        </Stack.Navigator>
      </NavigationContainer>

      <Toast config={toastConfig} />
    </>
  );
}
