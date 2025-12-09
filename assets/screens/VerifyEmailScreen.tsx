import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getAuth, sendEmailVerification } from "firebase/auth";
import Toast from "react-native-toast-message";
import { globalStyles } from "../components/globalStyles";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "VerifyEmail">;

export default function VerifyEmailScreen({ navigation, route }: Props) {
    const { email } = route.params;
    const auth = getAuth();

    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(20);
    const [isVerified, setIsVerified] = useState(false);

    // -------------------------------------------
    // TEMPORIZADOR DE 20 SEG
    // -------------------------------------------
    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    // -------------------------------------------
    // AUTO-CHECK CADA 3 SEGUNDOS
    // -------------------------------------------
    useEffect(() => {
        const interval = setInterval(async () => {
            await auth.currentUser?.reload();
            if (auth.currentUser?.emailVerified) {
                setIsVerified(true);
                clearInterval(interval);

                Toast.show({
                    type: "success",
                    text1: "Correo verificado",
                    text2: "Ya puedes usar tu cuenta.",
                });

                navigation.replace("Login");
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const resendEmail = async () => {
        if (!auth.currentUser) return;

        setLoading(true);
        try {
            await sendEmailVerification(auth.currentUser);
            setTimer(20);

            Toast.show({
                type: "success",
                text1: "Correo reenviado",
                text2: "Revisa tu bandeja de entrada.",
            });
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudo reenviar el correo.",
            });
        }
        setLoading(false);
    };

    return (
        <View style={globalStyles.verify_container}>
            <Text style={globalStyles.verify_title}>Verifica tu correo</Text>

            <Text style={globalStyles.verify_text}>
                Hemos enviado un enlace de verificación a:
            </Text>

            <Text style={globalStyles.verify_email}>{email}</Text>

            <Text style={globalStyles.verify_text}>
                Una vez verificado podrás iniciar sesión.
            </Text>

            {loading ? (
                <ActivityIndicator size="large" color="#FFA500" style={{ marginTop: 20 }} />
            ) : (
                <TouchableOpacity
                    disabled={timer > 0}
                    onPress={resendEmail}
                    style={[
                        globalStyles.verify_button,
                        { opacity: timer > 0 ? 0.5 : 1 },
                    ]}
                >
                    <Text style={globalStyles.verify_buttonText}>
                        {timer > 0 ? `Reenviar (${timer})` : "Reenviar correo"}
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                onPress={() => navigation.replace("Login")}
                style={globalStyles.verify_backButton}
            >
                <Text style={globalStyles.verify_backText}>Volver al login</Text>
            </TouchableOpacity>
        </View>
    );
}
