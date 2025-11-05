// assets/screens/Home.tsx
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ImageBackground, Alert, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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
          style={styles.floatingButton}
          onPress={() => navigation.navigate('NewGame')}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#FB6600',
    width: 65,
    height: 65,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 36,
  },
});

export default HomeScreen;
