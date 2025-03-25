import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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

  const [usernameFocusAnim] = useState(new Animated.Value(0));
  const [passwordFocusAnim] = useState(new Animated.Value(0));

  const handleInputFocus = (animValue: Animated.Value) => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputBlur = (animValue: Animated.Value) => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const loginAnimation = {
    transform: [
      {
        translateY: usernameFocusAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
    top: usernameFocusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5],
    }),
  };

  const passwordAnimation = {
    transform: [
      {
        translateY: passwordFocusAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
    top: passwordFocusAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -5],
    }),
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Por favor, ingresa usuario y contraseña.');
      setLoading(false);
      return;
    }

    try {
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

  const ORANGE = '#FFA500';
  const WHITE = '#FFF';
  const BLACK = '#000';
  const GRAY = '#888';
  const LIGHT_GRAY = '#666';
  const RED = 'red';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SHOOT TRACKER</Text>
      </View>

      <View style={styles.inputContainer}>
        <Animated.View style={[styles.inputWrapper, loginAnimation]}>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor={GRAY}
            value={username}
            onChangeText={setUsername}
            onFocus={() => handleInputFocus(usernameFocusAnim)}
            onBlur={() => handleInputBlur(usernameFocusAnim)}
            accessibilityLabel="Usuario"
            accessibilityHint="Ingresa tu nombre de usuario"
          />
        </Animated.View>

        <Animated.View style={[styles.inputWrapper, passwordAnimation]}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={GRAY}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onFocus={() => handleInputFocus(passwordFocusAnim)}
            onBlur={() => handleInputBlur(passwordFocusAnim)}
            accessibilityLabel="Contraseña"
            accessibilityHint="Ingresa tu contraseña"
          />
        </Animated.View>

        {loading && <ActivityIndicator size="large" color={ORANGE} />}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} accessibilityLabel="Iniciar sesión" accessibilityHint="Presiona para iniciar sesión">
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <View style={styles.additionalActionsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('RecoverAccount')} accessibilityLabel="Recuperar contraseña" accessibilityHint="Presiona para recuperar tu contraseña">
            <Text style={styles.additionalActionText}>
              ¿Olvidaste tu contraseña? <Text style={styles.highlightText}>Recuperar contraseña</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.createAccountContainer} accessibilityLabel="Crear cuenta" accessibilityHint="Presiona para crear una cuenta nueva">
            <Text style={styles.createAccountText}>Crear cuenta nueva</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.versionText}>ShootTracker v20.3.25 [Build 1]</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 50,
  },
  logoText: {
    color: '#FF8800',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF8800',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: '#FF8800',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  additionalActionsContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  additionalActionText: {
    color: '#FFF',
    textAlign: 'center',
  },
  highlightText: {
    color: '#FF8800',
  },
  createAccountContainer: {
    marginTop: 15,
  },
  createAccountText: {
    color: '#FF8800',
    fontWeight: 'bold',
  },
  versionText: {
    position: 'absolute',
    bottom: 10,
    color: '#666',
    fontSize: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;