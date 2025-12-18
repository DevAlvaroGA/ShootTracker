import { collection, addDoc, serverTimestamp, Timestamp, getDoc, doc, } from "firebase/firestore";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import FieldSelectorModal from "../components/FieldSelectorModal";
import { globalStyles } from "../components/globalStyles";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import type { RootStackParamList } from "../../App";
import { useMaster } from "../hooks/useMaster";
import Toast from "react-native-toast-message";
import { useFields } from "../hooks/useFields";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { db } from "@/firebaseConfig";

export default function NewGame({
    navigation,
    route,
}: NativeStackScreenProps<RootStackParamList, "NewGame">) {

    // ============================
    // MASTER DATA
    // ============================
    const master = useMaster();

    // ============================
    // CAMPOS
    // ============================
    const { fields, addField } = useFields();
    const [modalOpen, setModalOpen] = useState(false);

    // CAMBIO REAL: guardamos ID + nombre
    const preselectedField = route?.params?.fieldName ?? "";
    const [fieldId, setFieldId] = useState<string | null>(null);
    const [fieldName, setFieldName] = useState(preselectedField);
    const fieldLocked = preselectedField !== "";

    // ============================
    // DATE
    // ============================
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);

    // ============================
    // GAME STATS
    // ============================
    const [kills, setKills] = useState("");
    const [deaths, setDeaths] = useState("");

    // ============================
    // DROPDOWNS
    // ============================
    const [openMode, setOpenMode] = useState(false);
    const [gameMode, setGameMode] = useState<string | null>(null);

    const [openWeapon1, setOpenWeapon1] = useState(false);
    const [weapon1, setWeapon1] = useState<string | null>(null);

    const [openWeapon2, setOpenWeapon2] = useState(false);
    const [weapon2, setWeapon2] = useState<string | null>(null);

    const [openResult, setOpenResult] = useState(false);
    const [selectedResult, setSelectedResult] = useState<string | null>(null);

    // ============================
    // SAVE GAME
    // ============================
    const handleSave = async () => {
        if (
            !fieldName ||
            !kills ||
            !deaths ||
            !weapon1 ||
            !weapon2 ||
            !gameMode ||
            !selectedResult
        ) {
            return Toast.show({
                type: "error",
                text1: "Error",
                text2: "Completa todos los campos.",
            });
        }

        const date = new Date(year, month - 1, day);
        if (date > new Date()) {
            return Toast.show({
                type: "error",
                text1: "Fecha incorrecta",
            });
        }

        const userId = getAuth().currentUser?.uid;
        if (!userId) {
            return Toast.show({
                type: "error",
                text1: "Usuario no autenticado",
            });
        }

        try {
            const userDoc = await getDoc(doc(db, "users", userId));
            const username = userDoc.exists()
                ? userDoc.data().USERNAME || userDoc.data().NAME || null
                : null;

            const response = await fetch("http://10.0.2.2:3000/calculateScore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    kills: Number(kills),
                    deaths: Number(deaths),
                    result: selectedResult,
                }),
            });

            const { score } = await response.json();

            await addDoc(collection(db, "games"), {
                uid: userId,
                username,

                fieldId,      // ✅ NUEVO (clave para historial)
                fieldName,    // 🔹 legacy / fallback

                gameMode,
                weapon1,
                weapon2,
                kills: Number(kills),
                deaths: Number(deaths),
                result: selectedResult,
                score,
                matchDate: Timestamp.fromDate(date),
                createdAt: serverTimestamp(),
                delete_mark: "N",
            });

            Toast.show({ type: "success", text1: "Partida guardada" });
            navigation.goBack();

        } catch {
            Toast.show({ type: "error", text1: "Error al guardar" });
        }
    };

    // ============================
    // UI (RESTAURADA COMPLETA)
    // ============================
    return (
        <SafeAreaView style={globalStyles.NW_container}>
            <ScrollView>

                <Text style={globalStyles.NW_title}>Nueva Partida</Text>

                {/* CAMPO */}
                <Text style={globalStyles.NW_label}>Campo de juego</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                        style={[globalStyles.NW_input, { flex: 1 }, fieldLocked && { opacity: 0.5 }]}
                        placeholder="Nombre del campo"
                        placeholderTextColor="#888"
                        editable={!fieldLocked}
                        value={fieldName}
                        onChangeText={setFieldName}
                    />

                    {!fieldLocked && (
                        <TouchableOpacity
                            onPress={() => setModalOpen(true)}
                            style={{ marginLeft: 10 }}
                        >
                            <Ionicons name="list" size={30} color="#FF8800" />
                        </TouchableOpacity>
                    )}
                </View>

                <FieldSelectorModal
                    visible={modalOpen}
                    onClose={() => setModalOpen(false)}
                    fields={fields}
                    onSelect={(field) => {
                        setFieldId(field.id);
                        setFieldName(field.name);
                    }}
                    onCreate={async (name) => {
                        const newField = await addField(name);
                        if (newField) {
                            setFieldId(newField.id);
                            setFieldName(newField.name);
                        }
                    }}
                />

                {/* FECHA */}
                <Text style={globalStyles.NW_label}>Fecha</Text>
                <View style={globalStyles.NW_pickerRow}>
                    <Picker selectedValue={day} onValueChange={setDay} style={globalStyles.NW_picker}>
                        {Array.from({ length: 31 }, (_, i) => (
                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>

                    <Picker selectedValue={month} onValueChange={setMonth} style={globalStyles.NW_picker}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>

                    <Picker selectedValue={year} onValueChange={setYear} style={globalStyles.NW_picker}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <Picker.Item key={i} label={`${2025 - i}`} value={2025 - i} />
                        ))}
                    </Picker>
                </View>

                {/* MODO */}
                <Text style={globalStyles.NW_label}>Modo de juego</Text>
                <DropDownPicker
                    open={openMode}
                    value={gameMode}
                    items={Object.entries(master.gameModes).map(([id, name]) => ({
                        label: name,
                        value: id,
                    }))}
                    setOpen={setOpenMode}
                    setValue={setGameMode}
                    setItems={() => { }}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    placeholder="Selecciona un modo"
                    textStyle={{ color: "#ccc", fontFamily: "Michroma" }}
                    listMode="SCROLLVIEW"
                    zIndex={3000}
                />

                {/* ARMA PRINCIPAL */}
                <Text style={globalStyles.NW_label}>Arma principal</Text>
                <DropDownPicker
                    open={openWeapon1}
                    value={weapon1}
                    items={Object.entries(master.primaryGuns).map(([id, name]) => ({
                        label: name,
                        value: id,
                    }))}
                    setOpen={setOpenWeapon1}
                    setValue={setWeapon1}
                    setItems={() => { }}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    placeholder="Selecciona un arma"
                    textStyle={{ color: "#ccc", fontFamily: "Michroma" }}
                    listMode="SCROLLVIEW"
                    zIndex={2500}
                />

                {/* ARMA SECUNDARIA */}
                <Text style={globalStyles.NW_label}>Arma secundaria</Text>
                <DropDownPicker
                    open={openWeapon2}
                    value={weapon2}
                    items={Object.entries(master.secondaryGuns).map(([id, name]) => ({
                        label: name,
                        value: id,
                    }))}
                    setOpen={setOpenWeapon2}
                    setValue={setWeapon2}
                    setItems={() => { }}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    placeholder="Selecciona un arma"
                    textStyle={{ color: "#ccc", fontFamily: "Michroma" }}
                    listMode="SCROLLVIEW"
                    zIndex={2000}
                />

                {/* KILLS / DEATHS */}
                <View style={globalStyles.NW_row}>
                    <View style={globalStyles.NW_numberInputWrap}>
                        <Text style={globalStyles.NW_smallLabel}>Kills</Text>
                        <TextInput
                            style={globalStyles.NW_numberInput}
                            keyboardType="numeric"
                            placeholder="-"
                            placeholderTextColor="#888"
                            value={kills}
                            onChangeText={setKills}
                        />
                    </View>

                    <View style={globalStyles.NW_numberInputWrap}>
                        <Text style={globalStyles.NW_smallLabel}>Muertes</Text>
                        <TextInput
                            style={globalStyles.NW_numberInput}
                            keyboardType="numeric"
                            placeholder="-"
                            placeholderTextColor="#888"
                            value={deaths}
                            onChangeText={setDeaths}
                        />
                    </View>
                </View>

                {/* RESULTADO */}
                <Text style={globalStyles.NW_label}>Resultado</Text>
                <DropDownPicker
                    open={openResult}
                    value={selectedResult}
                    items={Object.entries(master.results).map(([id, name]) => ({
                        label: name,
                        value: id,
                    }))}
                    setOpen={setOpenResult}
                    setValue={setSelectedResult}
                    setItems={() => { }}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    placeholder="Selecciona un resultado"
                    textStyle={{ color: "#ccc", fontFamily: "Michroma" }}
                    listMode="SCROLLVIEW"
                    zIndex={1500}
                />

                {/* SAVE */}
                <TouchableOpacity
                    style={globalStyles.NW_primaryButton}
                    onPress={handleSave}
                >
                    <Text style={globalStyles.NW_primaryButtonText}>
                        Guardar Partida
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}
