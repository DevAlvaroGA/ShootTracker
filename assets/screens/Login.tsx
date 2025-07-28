import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles'; // Importa los estilos globales desde tu archivo

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  RecoverAccount: undefined;
  Register: undefined;
};

const LoginScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    // Validar campos vacíos antes de mostrar loading
    if (!username.trim() || !password.trim()) {
      setError('Por favor, ingresa usuario y contraseña.');
      return;
    }

    setLoading(true);

    try {
      // Simulación de llamada a API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (username === 'test' && password === 'test') {
        navigation.navigate('Home');
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    } catch (e) {
      setError('Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ImageBackground
        source={require('../images/fondo.png')}
        style={globalStyles.backgroundImage}
        resizeMode="cover"
      >
        {/* KeyboardAvoidingView para manejar el teclado */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // 'padding' para iOS, 'height' para Android
          style={globalStyles.content} // Aplica el estilo de contenido aquí
        >
          {/* ScrollView para permitir el desplazamiento si el contenido es demasiado grande */}
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            {/*
              Observación: Los elementos del logo (logoContainer y logoText)
              fueron eliminados del JSX en esta versión de LoginScreen.
              Si deseas que aparezcan, deberías re-añadirlos aquí:
            */}
            {/* <View style={globalStyles.logoContainer}>
              <Text style={globalStyles.logoText}>SHOOT</Text>
              <Text style={globalStyles.logoText}>TRACKER</Text>
            </View> */}

            {/* Formulario */}
            <View style={globalStyles.formContainer}>
              <View style={globalStyles.inputWrapper}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Usuario"
                  placeholderTextColor="#888"
                  value={username}
                  onChangeText={setUsername}
                  accessibilityLabel="Usuario"
                  accessibilityHint="Ingresa tu nombre de usuario"
                />
              </View>

              <View style={globalStyles.inputWrapper}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  accessibilityLabel="Contraseña"
                  accessibilityHint="Ingresa tu contraseña"
                />
              </View>

              {loading && (
                <View style={globalStyles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFA500" />
                </View>
              )}

              {error ? (
                <View style={globalStyles.errorContainer}>
                  <Text style={globalStyles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={globalStyles.loginButton}
                onPress={handleLogin}
                disabled={loading}
                accessibilityLabel="Iniciar sesión"
                accessibilityHint="Presiona para iniciar sesión"
              >
                <Text style={globalStyles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              {/* Enlaces adicionales */}
              <TouchableOpacity
                onPress={() => navigation.navigate('RecoverAccount')}
                style={globalStyles.forgotPasswordContainer}
                accessibilityLabel="Recuperar contraseña"
                accessibilityHint="Presiona para recuperar tu contraseña"
              >
                <Text style={globalStyles.forgotPasswordText}>
                  ¿Olvidaste tu contraseña? <Text style={globalStyles.highlightText}>Recuperar contraseña</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botón crear cuenta */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={globalStyles.createAccountButton}
              accessibilityLabel="Crear cuenta"
              accessibilityHint="Presiona para crear una cuenta nueva"
            >
              <Text style={globalStyles.createAccountText}>Crear cuenta nueva</Text>
            </TouchableOpacity>

            {/* Versión */}
            <Text style={globalStyles.versionText}>ShootTracker v20.3.25 [Build 1]</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;
