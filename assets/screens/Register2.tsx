import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ImageBackground,
    ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../components/globalStyles";
import { db, auth } from "@/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Toast from "react-native-toast-message";

import { RootStackParamList } from "../../App";  // IMPORTA EL TIPO DESDE App.tsx

// TIPO TIPADO CORRECTAMENTE PARA PARAMS OPCIONALES
type Props = NativeStackScreenProps<RootStackParamList, "Register2">;

const Register2 = ({ navigation, route }: Props) => {

    // Si vienen params → OK
    // Si no vienen → los inicializamos vacíos para evitar errores
    const { email = "", password = "", username = "" } = route.params ?? {};

    const [name, setName] = useState("");
    const [surnames, setSurnames] = useState("");
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2000);
    const [loading, setLoading] = useState(false);

    const handleSaveData = async () => {
        if (!name.trim() || !surnames.trim()) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Completa todos los campos.",
                visibilityTime: 3000
            });
            return;
        }

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        const age =
            today.getFullYear() -
            birthDate.getFullYear() -
            (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

        if (birthDate > today) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "La fecha de nacimiento no puede ser futura.",
                visibilityTime: 3000
            });
            return;
        }

        if (age < 14) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Debes tener al menos 14 años para registrarte.",
                visibilityTime: 3000
            });
            return;
        }

        if (!email || !password || !username) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Faltan datos del registro. Vuelve a intentarlo.",
                visibilityTime: 3000
            });
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), {
                NAME: name,
                SURNAMES: surnames,
                USERNAME: username,
                DATE_BIRTH: birthDate,
                REGISTER_DATE: serverTimestamp(),
                DELETED_AT: null,
                DELETE_MARK: "N",
            });

            Toast.show({
                type: "success",
                text1: "Registro completado",
                text2: "Tu cuenta y perfil se han creado correctamente.",
                visibilityTime: 3000
            });

            navigation.navigate("Login");
        } catch (error: any) {
            console.error("❌ Error al crear usuario/guardar datos:", error);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: `No se pudieron guardar tus datos: ${error.message}`,
                visibilityTime: 3000
            });
        } finally {
            setLoading(false);
        }
    };

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
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                        <View style={globalStyles.REGISTER_formContainer}>
                            <Text style={globalStyles.REGISTER_titleText}>Completa tu perfil</Text>

                            <TextInput
                                style={globalStyles.REGISTER_input}
                                placeholder="Nombre"
                                placeholderTextColor="#888"
                                value={name}
                                onChangeText={setName}
                            />

                            <TextInput
                                style={globalStyles.REGISTER_input}
                                placeholder="Apellidos"
                                placeholderTextColor="#888"
                                value={surnames}
                                onChangeText={setSurnames}
                            />

                            <Text style={{ color: "#888", marginTop: 10, marginBottom: 5 }}>
                                Fecha de nacimiento
                            </Text>

                            <View style={globalStyles.pickerContainer}>
                                <View style={globalStyles.pickerWrapper}>
                                    <Picker
                                        style={globalStyles.picker}
                                        dropdownIconColor="#FB6600"
                                        selectedValue={day}
                                        onValueChange={setDay}
                                    >
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={globalStyles.pickerWrapper}>
                                    <Picker
                                        style={globalStyles.picker}
                                        dropdownIconColor="#FB6600"
                                        selectedValue={month}
                                        onValueChange={setMonth}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={[globalStyles.pickerWrapper, globalStyles.yearPicker]}>
                                    <Picker
                                        style={globalStyles.picker}
                                        dropdownIconColor="#FB6600"
                                        selectedValue={year}
                                        onValueChange={setYear}
                                    >
                                        {Array.from({ length: 100 }, (_, i) => (
                                            <Picker.Item key={i} label={`${2025 - i}`} value={2025 - i} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            {loading && <ActivityIndicator size="large" color="#FFA500" />}

                            <TouchableOpacity
                                style={globalStyles.REGISTER_Button}
                                onPress={handleSaveData}
                                disabled={loading}
                            >
                                <Text style={globalStyles.REGISTER_ButtonText}>
                                    Finalizar registro
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Register2;
