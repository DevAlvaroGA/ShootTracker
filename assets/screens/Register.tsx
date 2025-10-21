import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, KeyboardAvoidingView, Platform, ImageBackground, ActivityIndicator, Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "@/firebaseConfig";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
};

const RegisterScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Register'>) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario registrado:", user.email);
      Alert.alert("Registro exitoso", "Tu cuenta se ha creado correctamente.");
      navigation.navigate('Home');
    } catch (error: any) {
      console.log("Error en registro:", error);
      Alert.alert("Error al registrarse", error.message);
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
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={globalStyles.formContainer}>
              <TextInput
                style={globalStyles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={globalStyles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <TextInput
                style={globalStyles.input}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={globalStyles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              {loading && <ActivityIndicator size="large" color="#FFA500" />}
              {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={globalStyles.loginButton}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={globalStyles.loginButtonText}>Registrarse</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={globalStyles.forgotPasswordText}>
                  ¿Ya tienes cuenta? <Text style={globalStyles.highlightText}>Iniciar sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default RegisterScreen;
