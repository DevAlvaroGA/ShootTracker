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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  Register2: { email: string; password: string; username: string }; // Pasamos datos a la siguiente pantalla
};

const RegisterScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Register'>) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setError('');

    // Validación de campos
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Validación de contraseñas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    // Navegamos a Register2 pasando los datos
    navigation.navigate('Register2', { email, password, username });
    setLoading(false);
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
                  ¿Ya tienes cuenta? <Text style={globalStyles.REGISTER_HaveAccountText}>Iniciar sesión</Text>
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
