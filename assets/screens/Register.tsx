// assets/screens/Register.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, KeyboardAvoidingView, Platform, ImageBackground, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Register2: { email: string; password: string };
};

const RegisterScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Register'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(p);

  const handleRegister = () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return Toast.show({ type: 'error', text1: 'Completa todos los campos.' });
    }
    if (!validateEmail(email)) {
      return Toast.show({ type: 'error', text1: 'Correo no válido.' });
    }
    if (!validatePassword(password)) {
      return Toast.show({ type: 'error', text1: 'Contraseña débil.' });
    }
    if (password !== confirmPassword) {
      return Toast.show({ type: 'error', text1: 'Las contraseñas no coinciden.' });
    }

    setLoading(true);
    setTimeout(() => {
      navigation.navigate('Register2', { email, password });
      setLoading(false);
    }, 600);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ImageBackground source={require('../images/fondo.png')} style={globalStyles.backgroundImage} resizeMode="cover">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={globalStyles.content}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <View style={globalStyles.REGISTER_formContainer}>
              <Text style={globalStyles.REGISTER_titleText}>Registro</Text>

              <TextInput style={globalStyles.REGISTER_input} placeholder="Correo electrónico" placeholderTextColor="#888"
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

              <TextInput style={globalStyles.REGISTER_input} placeholder="Contraseña" placeholderTextColor="#888"
                value={password} onChangeText={setPassword} secureTextEntry />

              <TextInput style={globalStyles.REGISTER_input} placeholder="Confirmar contraseña" placeholderTextColor="#888"
                value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

              {loading && <ActivityIndicator size="large" color="#FFA500" />}

              <TouchableOpacity style={globalStyles.REGISTER_Button} onPress={handleRegister} disabled={loading}>
                <Text style={globalStyles.REGISTER_ButtonText}>Continuar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={globalStyles.REGISTER_HaveAccountText}>¿Ya tienes cuenta? <Text style={{ color: '#FF8800' }}>Iniciar sesión</Text></Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default RegisterScreen;
