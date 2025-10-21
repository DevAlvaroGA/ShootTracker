import React, { useState, useEffect } from 'react';
import { ImageBackground, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './assets/screens/Login';
import RegisterScreen from './assets/screens/Register';
import HomeScreen from './assets/screens/Home'; // nueva pantalla Home
import { globalStyles } from './assets/components/globalStyles';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResources = () => {
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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
