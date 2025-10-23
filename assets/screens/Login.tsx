import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  ForgotPassword: undefined; // futura pantalla
};

const LoginScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, ingresa tu email y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        console.log("Usuario autenticado:", user.email);
        navigation.navigate('Home');
      }
    } catch (error: any) {
      console.log("Error en inicio de sesión:", error);
      Alert.alert("Error", "Correo o contraseña incorrectos.");
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={globalStyles.content}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
            <View style={globalStyles.formContainer}>
              <View style={globalStyles.inputWrapper}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
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
                />
              </View>

              {loading && <ActivityIndicator size="large" color="#FFA500" />}

              {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={globalStyles.LOGIN_Button}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={globalStyles.LOGIN_ButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>

              {/* 🔽 Nuevo texto de recuperar contraseña */}
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ marginTop: 10, marginBottom: 10 }}>
                <Text style={globalStyles.LOGIN_forgotPasswordText}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {/* 🔼 Nuevo texto presionable para crear cuenta */}
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ alignItems: 'center', marginBottom: 10 }}>
              <Text style={globalStyles.LOGIN_newAccountText}>Crear cuenta nueva</Text>
            </TouchableOpacity>

            <Text style={globalStyles.versionText}>
              ShootTracker v20.3.25 [Build 1]
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;
