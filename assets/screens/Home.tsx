// assets/screens/Home.tsx
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../components/globalStyles';
import { auth } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import type { RootStackParamList } from '../../App';



const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ImageBackground
        source={require('../images/fondo.png')}
        style={globalStyles.backgroundImage}
        resizeMode="cover"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 28, color: '#fff', marginBottom: 20 }}>¡Hola Mundo!</Text>

          <TouchableOpacity
            style={globalStyles.LOGIN_Button}
            onPress={handleLogout}
          >
            <Text style={globalStyles.LOGIN_ButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* 🔹 Botón flotante “+” */}
        <TouchableOpacity
          style={globalStyles.floatingButton}
          onPress={() => navigation.navigate('NewGame')}
        >
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default HomeScreen;
