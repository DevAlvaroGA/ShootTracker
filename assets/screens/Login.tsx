import React, { useState, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { View, Text, StyleSheet, TextInput, Button, ImageBackground } from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Aquí iría la lógica de inicio de sesión
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <ImageBackground source={require('../images/fondo.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Usuario"
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                />
                <Button title="Iniciar Sesión" onPress={handleLogin} />
            </View>
        </ImageBackground>
    );
};
 
const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'contain',
        height: '100%',
      },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'FF8800'
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#FF8800',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    logButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#FF8800',
        borderRadius: 5,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;