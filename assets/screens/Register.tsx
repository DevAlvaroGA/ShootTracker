import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import Toast from 'react-native-toast-message';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Register2: { email: string; password: string; username: string };
};

const RegisterScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Register'>) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validación de correo
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validación de contraseña
  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = () => {
    setError('');

    // Reemplaza setError con esto:
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor, completa todos los campos.',
        visibilityTime: 3000,
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Correo electrónico no válido.',
        visibilityTime: 3000,
      });
      return;
    }

    if (!validatePassword(password)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Contraseña débil. Debe tener 8 caracteres, mayúscula, minúscula y un número.',
        visibilityTime: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Las contraseñas no coinciden.',
        visibilityTime: 3000,
      });
      return;
    }

    setLoading(true);

    // Si todo es correcto, pasamos a la siguiente pantalla
    setTimeout(() => {
      navigation.navigate('Register2', { email, password, username });
      setLoading(false);
    }, 800);
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

              <TextInput
                style={globalStyles.REGISTER_input}
                placeholder="Nombre de usuario"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
              />
              <TextInput
                style={globalStyles.REGISTER_input}
                placeholder="Correo electrónico"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={globalStyles.REGISTER_input}
                placeholder="Contraseña"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TextInput
                style={globalStyles.REGISTER_input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              {loading && <ActivityIndicator size="large" color="#FFA500" />}
              {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={globalStyles.REGISTER_Button}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={globalStyles.REGISTER_ButtonText}>Continuar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={globalStyles.REGISTER_HaveAccountText}>
                  ¿Ya tienes cuenta?{' '}
                  <Text style={[globalStyles.REGISTER_HaveAccountText, { fontWeight: 'bold' }]}>
                    Iniciar sesión
                  </Text>
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
