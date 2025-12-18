import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, ImageBackground, KeyboardAvoidingView, Platform, Image, Switch, } from "react-native";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential, } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { globalStyles } from "../components/globalStyles";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "@/firebaseConfig";

// Navigation stack types
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Completar sesión de autenticación web
WebBrowser.maybeCompleteAuthSession();

// Componente de pantalla de inicio de sesión y estados
const LoginScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Login">) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // -------------------------------------------------------------
  // GOOGLE AUTH
  // -------------------------------------------------------------
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "610622971890-jubbc2m1tjpaitqbrh20dja71e1hj4ld.apps.googleusercontent.com",
  });

  // -------------------------------------------------------------
  // Cargar datos guardados (rememberMe)
  // -------------------------------------------------------------
  useEffect(() => {
    const loadRememberedData = async () => {
      const savedRemember = await AsyncStorage.getItem("rememberMe");
      const savedEmail = await AsyncStorage.getItem("savedEmail");

      if (savedRemember === "true") {
        setRememberMe(true);

        if (savedEmail) setEmail(savedEmail);

        if (auth.currentUser) navigation.replace("Home");
      }
    };

    loadRememberedData();
  }, []);

  // -------------------------------------------------------------
  // Guardar usuario de Google al entrar por primera vez
  // -------------------------------------------------------------
  const saveGoogleUser = async (user: any) => {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        NAME: user.displayName || "Usuario",
        SURNAMES: null,
        USERNAME: user.email?.split("@")[0] || "usuario",
        EMAIL: user.email,
        DATE_BIRTH: null,
        REGISTER_DATE: serverTimestamp(),
        DELETED_AT: null,
        DELETE_MARK: "N",
      });
    }
  };

  // -------------------------------------------------------------
  // LOGIN NORMAL
  // -------------------------------------------------------------
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
      await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        await AsyncStorage.setItem("rememberMe", "true");
        await AsyncStorage.setItem("savedEmail", email);
      } else {
        await AsyncStorage.removeItem("rememberMe");
        await AsyncStorage.removeItem("savedEmail");
      }

      navigation.replace("Home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Credenciales inválidas",
        text2: "Revisa tu correo o contraseña.",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // LOGIN GOOGLE
  // -------------------------------------------------------------
  useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (!idToken) return;

      const credential = GoogleAuthProvider.credential(idToken);
      setLoading(true);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          await saveGoogleUser(userCredential.user);

          if (rememberMe) {
            await AsyncStorage.setItem("rememberMe", "true");
            await AsyncStorage.setItem(
              "savedEmail",
              userCredential.user.email || ""
            );
          } else {
            await AsyncStorage.removeItem("rememberMe");
            await AsyncStorage.removeItem("savedEmail");
          }

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

  // -------------------------------------------------------------
  // UI
  // -------------------------------------------------------------
  return (
    <SafeAreaView style={globalStyles.container}>
      <ImageBackground
        source={require("../images/fondo.png")}
        style={globalStyles.backgroundImage}
        resizeMode="cover"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            <View style={globalStyles.inputPasswordContainer}>
              <TextInput
                style={[globalStyles.LOGIN_input, { flex: 1, borderWidth: 0 }]}
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
                  color="#FB6600"
                />
              </TouchableOpacity>
            </View>

            {/* RECORDAR */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: "#ccc", true: "#FFA500" }}
                thumbColor="#fff"
              />
              <Text
                style={{
                  marginLeft: 6,
                  color: "#fff",
                  fontFamily: "Michroma",
                  fontSize: 15,
                }}
              >
                Recordar
              </Text>
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity
              style={globalStyles.LOGIN_Button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={globalStyles.LOGIN_ButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            {/* GOOGLE */}
            <TouchableOpacity
              style={globalStyles.LOGIN_Button}
              onPress={() => promptAsync()}
              disabled={!request}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={require("../images/google_icon.png")}
                  style={{ width: 24, height: 24, marginRight: 12 }}
                />
                <Text style={globalStyles.LOGIN_ButtonText}>
                  Iniciar sesión con Google
                </Text>
              </View>
            </TouchableOpacity>

            {/* FORGOT PASSWORD */}
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={globalStyles.LOGIN_forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* REGISTER */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={{ alignItems: "center", marginTop: 10 }}
            >
              <Text style={globalStyles.LOGIN_newAccountText}>
                Crear cuenta nueva
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Text style={globalStyles.versionText}>
          ShootTracker v20.3.25 [Build 1]
        </Text>
      </ImageBackground>

      {/* LOADING OVERLAY */}
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.93)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color="#FFA500" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default LoginScreen;
