// assets/screens/Register.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SafeAreaView,
  ScrollView, KeyboardAvoidingView, Platform, ImageBackground, ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import Toast from 'react-native-toast-message';
import { Ionicons } from "@expo/vector-icons";


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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(p);

  const handleRegister = () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      return Toast.show({ type: 'error', text1: 'Error', text2: 'Completa todos los campos.' });
    }
    if (!validateEmail(email)) {
      return Toast.show({ type: 'error', text1: 'Error', text2: 'Correo no válido.' });
    }
    if (!validatePassword(password)) {
      return Toast.show({ type: 'error', text1: 'Error', text2: 'Contraseña débil.' });
    }
    if (password !== confirmPassword) {
      return Toast.show({ type: 'error', text1: 'Error', text2: 'Las contraseñas no coinciden.' });
    }

    setLoading(true);
    setTimeout(() => {
      navigation.navigate('Register2', { email, password });
      setLoading(false);
    }, 600);
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
            <View style={globalStyles.REGISTER_formContainer}>
              <Text style={globalStyles.REGISTER_titleText}>Registro</Text>

              {/* EMAIL */}
              <TextInput
                style={globalStyles.REGISTER_input}
                placeholder="Correo electrónico"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* PASSWORD */}
              <View style={globalStyles.inputPasswordContainer}>
                <TextInput
                  style={[globalStyles.REGISTER_input, { flex: 1, borderWidth: 0 }]}
                  placeholder="Contraseña"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#FF8800"
                  />

                </TouchableOpacity>
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={globalStyles.inputPasswordContainer}>
                <TextInput
                  style={[globalStyles.REGISTER_input, { flex: 1, borderWidth: 0 }]}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#888"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#FF8800"
                  />
                </TouchableOpacity>
              </View>


              {loading && <ActivityIndicator size="large" color="#FF8800" />}

              <TouchableOpacity
                style={globalStyles.REGISTER_Button}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={globalStyles.REGISTER_ButtonText}>Continuar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={globalStyles.REGISTER_HaveAccountText}>
                  ¿Ya tienes cuenta?
                  <Text style={{ color: '#FF8800' }}> Iniciar sesión</Text>
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
