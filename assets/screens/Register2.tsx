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
    Alert,
    StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../components/globalStyles";
import { db, auth } from "@/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Register: undefined;
    Register2: { email: string; password: string; username: string };
};

const Register2 = ({ navigation, route }: NativeStackScreenProps<RootStackParamList, "Register2">) => {
    const { email, password, username } = route.params;

    const [name, setName] = useState("");
    const [surnames, setSurnames] = useState("");
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2000);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSaveData = async () => {
        setError("");

        if (!name.trim() || !surnames.trim()) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        const dateBirth = new Date(year, month - 1, day);

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            await setDoc(doc(db, "users", uid), {
                NAME: name,
                SURNAMES: surnames,
                USERNAME: username,
                DATE_BIRTH: dateBirth,
                REGISTER_DATE: serverTimestamp(),
                DELETED_AT: null,
                DELETE_MARK: "N",
            });

            Alert.alert("Registro completado", "Tu cuenta y perfil se han creado correctamente.");
            navigation.navigate("Home");
        } catch (error: any) {
            console.error("❌ Error al crear usuario/guardar datos:", error);
            Alert.alert("Error", `No se pudieron guardar tus datos: ${error.message}`);
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

                            <Text style={{ color: "#888", marginTop: 10, marginBottom: 5 }}>Fecha de nacimiento</Text>
                            <View style={styles.pickerContainer}>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        style={styles.picker}
                                        dropdownIconColor="#FB6600"
                                        selectedValue={day}
                                        onValueChange={setDay}
                                    >
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        style={styles.picker}
                                        dropdownIconColor="#FB6600"
                                        selectedValue={month}
                                        onValueChange={setMonth}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                                        ))}
                                    </Picker>
                                </View>

                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        style={styles.picker}
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
                            {error ? <Text style={globalStyles.errorText}>{error}</Text> : null}

                            <TouchableOpacity
                                style={globalStyles.REGISTER_Button}
                                onPress={handleSaveData}
                                disabled={loading}
                            >
                                <Text style={globalStyles.REGISTER_ButtonText}>Finalizar registro</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 5,
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 10,
        marginHorizontal: 3,
        borderWidth: 1,
        borderColor: "#FB6600",
        justifyContent: "center",
    },
    picker: {
        color: "#000",
    },
});

export default Register2;
