import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, ImageBackground, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '@/firebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { globalStyles } from '../components/globalStyles';

type RootStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
};

const ForgotPasswordScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor, introduce tu correo electrónico.');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                'Correo enviado',
                'Hemos enviado un enlace a tu correo para restablecer la contraseña.'
            );
            navigation.goBack(); // vuelve al login
        } catch (error: any) {
            console.log('Error al enviar correo:', error);
            if (error.code === 'auth/user-not-found') {
                Alert.alert('Error', 'No existe ninguna cuenta con ese correo.');
            } else if (error.code === 'auth/invalid-email') {
                Alert.alert('Error', 'El correo no es válido.');
            } else {
                Alert.alert('Error', 'No se pudo enviar el correo. Inténtalo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

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
