import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, SafeAreaView } from 'react-native';
import * as Progress from 'react-native-progress';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './assets/screens/Login'; // Asegúrate de que la ruta sea correcta

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  RecoverAccount: undefined;
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
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('./assets/images/Airsoft_BW.png')} style={styles.background}>
          <View style={styles.loadingContainer}>
            <Progress.Bar progress={progress} width={340} color="#FB6600" borderColor="#FFFF" />
          </View>
          <View style={styles.logoContainer}>
            <ImageBackground source={require('./assets/images/logo.png')} style={styles.logo} />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 600,
    height: 200,
    resizeMode: 'contain',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -170 }, { translateY: 410 }],
  },
});