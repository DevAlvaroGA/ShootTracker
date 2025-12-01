import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import Toast from 'react-native-toast-message';
import * as WebBrowser from 'expo-web-browser';
import * as Google from "expo-auth-session/providers/google";

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Login'>) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ------------------------
  // GOOGLE AUTH HOOK
  // ------------------------
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "610622971890-jubbc2m1tjpaitqbrh20dja71e1hj4ld.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@alvinotintx/ShootTracker_cod",
  });

  // ------------------------
  // Recordar sesión
  // ------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigation.replace("Home");
    });
    return unsubscribe;
  }, []);

  // ------------------------
  // Guardar usuario Google en Firestore
  // ------------------------
  const saveGoogleUser = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        NAME: user.displayName || "Usuario",
        SURNAMES: null,
        USERNAME: user.email?.split("@")[0] || "usuario",
        DATE_BIRTH: null,
        DELETE_MARK: "N",
        DELETED_AT: null,
        REGISTER_DATE: serverTimestamp(),
        EMAIL: user.email,
      });
    }
  };

  // ------------------------
  // LOGIN NORMAL
  // ------------------------
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Toast.show({
        type: "error",
        text1: "Campos incompletos",
        text2: "Introduce tu correo y contraseña.",
      });
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        Toast.show({
          type: "error",
          text1: "Correo no verificado",
          text2: "Valida tu correo antes de iniciar sesión.",
        });
        return;
      }

      // Aquí podrías usar rememberMe para guardar en AsyncStorage si quieres
      navigation.replace("Home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Credenciales inválidas",
        text2: "Revisa tu correo o contraseña.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------
  // GOOGLE LOGIN
  // ------------------------
  useEffect(() => {
    if (response?.type === "success") {
      const idToken = (response.authentication as any)?.id_token;
      if (!idToken) return;

      const credential = GoogleAuthProvider.credential(idToken);
      setLoading(true);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          await saveGoogleUser(userCredential.user);
          Toast.show({
            type: "success",
            text1: "Bienvenido",
            text2: "Sesión iniciada con Google",
          });
          navigation.replace("Home");
        })
        .catch(() => {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No se pudo iniciar sesión con Google",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [response]);

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
          <View style={globalStyles.formContainer}>
            {/* EMAIL */}
            <TextInput
              style={globalStyles.LOGIN_input}
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            {/* PASSWORD */}
            <TextInput
              style={globalStyles.LOGIN_input}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* RECORDAR USUARIO */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: '#ccc', true: '#FFA500' }}
                thumbColor={rememberMe ? '#fff' : '#fff'}
              />
              <Text style={{ marginLeft: 6, color: '#fff', fontFamily: 'Michroma', fontSize: 15 }}>
                Recordar
              </Text>
            </View>

            {loading && <ActivityIndicator size="large" color="#FFA500" style={globalStyles.loadingContainer} />}

            {/* BOTÓN LOGIN */}
            <TouchableOpacity style={globalStyles.LOGIN_Button} onPress={handleLogin} disabled={loading}>
              <Text style={globalStyles.LOGIN_ButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            {/* BOTÓN GOOGLE */}
            <TouchableOpacity style={globalStyles.LOGIN_Button} onPress={() => promptAsync()} disabled={!request}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                <Image source={require('../images/google_icon.png')} style={{ width: 24, height: 24, marginRight: 12 }} />
                <Text style={globalStyles.LOGIN_ButtonText}>Iniciar sesión con Google</Text>
              </View>
            </TouchableOpacity>

            {/* RECUPERAR CONTRASEÑA */}
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={globalStyles.LOGIN_forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* CREAR CUENTA */}
            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={globalStyles.LOGIN_newAccountText}>Crear cuenta nueva</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Text style={globalStyles.versionText}>
          ShootTracker v20.3.25 [Build 1]
        </Text>
      </ImageBackground>

      <Toast />
    </SafeAreaView>
  );
};

export default LoginScreen;
