import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ImageBackground, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import { sendPasswordResetEmail } from 'firebase/auth';
import Toast from "react-native-toast-message";
import React, { useState } from 'react';
import { auth } from '@/firebaseConfig';

// Navigation stack types
type RootStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
};
// Propiedades del componente
const ForgotPasswordScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    // Control de eventos
    const handlePasswordReset = async () => {
        if (!email.trim()) {
            return Toast.show({
                type: "error",
                text1: "Error",
                text2: "Introduce tu correo electrónico."
            });
        }

        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);

            Toast.show({
                type: "success",
                text1: "Correo enviado",
                text2: "Revisa tu bandeja de entrada."
            });

            navigation.goBack();

        } catch (error: any) {
            console.log("Error al enviar correo:", error);

            if (error.code === "auth/user-not-found") {
                Toast.show({
                    type: "error",
                    text1: "Usuario no encontrado",
                    text2: "No existe ninguna cuenta con ese correo."
                });
            } else if (error.code === "auth/invalid-email") {
                Toast.show({
                    type: "error",
                    text1: "Correo inválido",
                    text2: "Introduce un formato de correo válido."
                });
            } else {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "No se pudo enviar el correo. Inténtalo más tarde."
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Renderizado del componente
    return (
        <SafeAreaView style={globalStyles.container}>
            <ImageBackground
                source={require('../images/fondo.png')}
                style={globalStyles.backgroundImage}
            >
                <View style={globalStyles.PASSWORD_formContainer}>
                    <Text style={globalStyles.PASSWORD_titleText}>Recuperar contraseña</Text>

                    <TextInput
                        style={globalStyles.PASSWORD_input}
                        placeholder="Introduce tu correo"
                        placeholderTextColor="#888"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity
                        style={globalStyles.PASSWORD_Button}
                        onPress={handlePasswordReset}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={globalStyles.PASSWORD_ButtonText}>Enviar correo</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={globalStyles.PASSWORD_HomeText}>Volver al inicio de sesión</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ForgotPasswordScreen;
