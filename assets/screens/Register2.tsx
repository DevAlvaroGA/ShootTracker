// assets/screens/Register2.tsx
import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, SafeAreaView,
    ScrollView, KeyboardAvoidingView, Platform, ImageBackground, ActivityIndicator
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../components/globalStyles";
import { db, auth } from "@/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Toast from "react-native-toast-message";
import type { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "Register2">;

export default function Register2({ navigation, route }: Props) {
    const { email = "", password = "" } = route.params ?? {};
    const [name, setName] = useState("");
    const [surnames, setSurnames] = useState("");
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2000);
    const [loading, setLoading] = useState(false);

    const handleSaveData = async () => {
        if (!name.trim() || !surnames.trim()) {
            return Toast.show({ type: "error", text1: "Completa todos los campos." });
        }

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear() - (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

        if (age < 14) {
            return Toast.show({ type: "error", text1: "Edad no válida", text2: "Debes tener al menos 14 años." });
        }

        setLoading(true);
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCred.user.uid;

            // Guardamos users SIN USERNAME (lo dejamos para game_profile)
            await setDoc(doc(db, "users", uid), {
                NAME: name,
                SURNAMES: surnames,
                DATE_BIRTH: birthDate,
                REGISTER_DATE: serverTimestamp(),
                DELETED_AT: null,
                DELETE_MARK: "N",
                EMAIL: email,
            });

            // No creamos game_profile aquí: lo creamos en Profile si falta.
            await sendEmailVerification(userCred.user);

            Toast.show({ type: "success", text1: "Cuenta creada", text2: "Revisa tu correo para verificarla." });
            navigation.replace("VerifyEmail", { email });

        } catch (error: any) {
            Toast.show({ type: "error", text1: "Error", text2: error.message || "No se pudo crear la cuenta." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <ImageBackground source={require("../images/fondo.png")} style={globalStyles.backgroundImage}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={globalStyles.content}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                        <View style={globalStyles.REGISTER_formContainer}>
                            <Text style={globalStyles.REGISTER_titleText}>Completa tu perfil</Text>

                            <TextInput style={globalStyles.REGISTER_input} placeholder="Nombre" placeholderTextColor="#888" value={name} onChangeText={setName} />
                            <TextInput style={globalStyles.REGISTER_input} placeholder="Apellidos" placeholderTextColor="#888" value={surnames} onChangeText={setSurnames} />

                            <Text style={{ color: "#888", marginTop: 10, marginBottom: 5 }}>Fecha de nacimiento</Text>
                            <View style={globalStyles.pickerContainer}>
                                <View style={globalStyles.pickerWrapper}>
                                    <Picker style={globalStyles.picker} dropdownIconColor="#FB6600" selectedValue={day} onValueChange={setDay}>
                                        {Array.from({ length: 31 }, (_, i) => <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />)}
                                    </Picker>
                                </View>
                                <View style={globalStyles.pickerWrapper}>
                                    <Picker style={globalStyles.picker} dropdownIconColor="#FB6600" selectedValue={month} onValueChange={setMonth}>
                                        {Array.from({ length: 12 }, (_, i) => <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />)}
                                    </Picker>
                                </View>
                                <View style={[globalStyles.pickerWrapper, globalStyles.yearPicker]}>
                                    <Picker style={globalStyles.picker} dropdownIconColor="#FB6600" selectedValue={year} onValueChange={setYear}>
                                        {Array.from({ length: 100 }, (_, i) => <Picker.Item key={i} label={`${2025 - i}`} value={2025 - i} />)}
                                    </Picker>
                                </View>
                            </View>

                            {loading && <ActivityIndicator size="large" color="#FFA500" />}

                            <TouchableOpacity style={globalStyles.REGISTER_Button} onPress={handleSaveData} disabled={loading}>
                                <Text style={globalStyles.REGISTER_ButtonText}>Finalizar registro</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
}
