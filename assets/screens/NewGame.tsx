// assets/screens/NewGame.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import {
    collection,
    getDocs,
    query,
    where,
    addDoc,
    serverTimestamp,
    Timestamp,
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { globalStyles } from "../components/globalStyles";

type Option = { label: string; value: string };

export default function NewGame({
    navigation,
    route,
}: NativeStackScreenProps<RootStackParamList, "NewGame">) {
    const preselectedField = route?.params?.fieldName ?? "";
    const [fieldName, setFieldName] = useState(preselectedField);
    const fieldLocked = preselectedField !== "";

    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);
    const [kills, setKills] = useState("");
    const [deaths, setDeaths] = useState("");

    // Dropdown states
    const [openMode, setOpenMode] = useState(false);
    const [gameMode, setGameMode] = useState<string | null>(null);
    const [gameModes, setGameModes] = useState<Option[]>([]);

    const [openWeapon1, setOpenWeapon1] = useState(false);
    const [weapon1, setWeapon1] = useState<string | null>(null);
    const [primaryWeapons, setPrimaryWeapons] = useState<Option[]>([]);

    const [openWeapon2, setOpenWeapon2] = useState(false);
    const [weapon2, setWeapon2] = useState<string | null>(null);
    const [secondaryWeapons, setSecondaryWeapons] = useState<Option[]>([]);

    const [openResult, setOpenResult] = useState(false);
    const [selectedResult, setSelectedResult] = useState<string | null>(null);
    const [results, setResults] = useState<Option[]>([]);

    // Cargar catálogos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const qMode = query(
                    collection(db, "master"),
                    where("master_type", "==", "game_mode")
                );
                const snapMode = await getDocs(qMode);
                setGameModes(
                    snapMode.docs
                        .map((d) => ({
                            label: d.data().name,
                            value: d.id,
                        }))
                        .filter((i) => i.label && i.value)
                );

                const q1 = query(
                    collection(db, "master"),
                    where("master_type", "==", "guns"),
                    where("value1", "==", "primaryGun")
                );
                const snap1 = await getDocs(q1);
                setPrimaryWeapons(
                    snap1.docs
                        .map((d) => ({ label: d.data().name, value: d.id }))
                        .filter((i) => i.label && i.value)
                );

                const q2 = query(
                    collection(db, "master"),
                    where("master_type", "==", "guns"),
                    where("value1", "==", "secondaryGun")
                );
                const snap2 = await getDocs(q2);
                setSecondaryWeapons(
                    snap2.docs
                        .map((d) => ({ label: d.data().name, value: d.id }))
                        .filter((i) => i.label && i.value)
                );

                const qRes = query(
                    collection(db, "master"),
                    where("master_type", "==", "results")
                );
                const snapRes = await getDocs(qRes);
                setResults(
                    snapRes.docs
                        .map((d) => ({ label: d.data().name, value: d.id }))
                        .filter((i) => i.label && i.value)
                );
            } catch (e) {
                Toast.show({ type: "error", text1: "Error cargando datos" });
            }
        };

        fetchData();
    }, []);

    // Guardar partida
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
        if (!userId)
            return Toast.show({
                type: "error",
                text1: "Usuario no autenticado",
            });

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
                fieldName,
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
        } catch (err) {
            Toast.show({ type: "error", text1: "Error al guardar" });
        }
    };

    return (
        <SafeAreaView style={globalStyles.NW_container}>
            <ScrollView>

                <Text style={globalStyles.NW_title}>Nueva Partida</Text>

                <Text style={globalStyles.NW_label}>Campo de juego</Text>
                <TextInput
                    style={[
                        globalStyles.NW_input,
                        fieldLocked && { opacity: 0.5 },
                    ]}
                    placeholder="Nombre del campo"
                    placeholderTextColor="#888888"
                    editable={!fieldLocked}
                    value={fieldName}
                    onChangeText={setFieldName}
                />

                <Text style={globalStyles.NW_label}>Fecha</Text>
                <View style={globalStyles.NW_pickerRow}>
                    <Picker
                        selectedValue={day}
                        onValueChange={setDay}
                        style={globalStyles.NW_picker}
                    >
                        {Array.from({ length: 31 }, (_, i) => (
                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={month}
                        onValueChange={setMonth}
                        style={globalStyles.NW_picker}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={year}
                        onValueChange={setYear}
                        style={globalStyles.NW_picker}
                    >
                        {Array.from({ length: 5 }, (_, i) => (
                            <Picker.Item key={i} label={`${2025 - i}`} value={2025 - i} />
                        ))}
                    </Picker>
                </View>

                {/* GAME MODE */}
                <Text style={globalStyles.NW_label}>Modo de juego</Text>
                <DropDownPicker
                    open={openMode}
                    value={gameMode}
                    items={gameModes}
                    setOpen={setOpenMode}
                    setValue={setGameMode}
                    setItems={setGameModes}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    textStyle={{ color: "#888888", fontFamily: "Michroma" }}
                    placeholder="Selecciona un modo"
                    listMode="SCROLLVIEW"
                    zIndex={3000}
                />

                {/* PRIMARY WEAPON */}
                <Text style={globalStyles.NW_label}>Arma principal</Text>
                <DropDownPicker
                    open={openWeapon1}
                    value={weapon1}
                    items={primaryWeapons}
                    setOpen={setOpenWeapon1}
                    setValue={setWeapon1}
                    setItems={setPrimaryWeapons}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    textStyle={{ color: "#888888", fontFamily: "Michroma" }}
                    placeholder="Selecciona un arma"
                    listMode="SCROLLVIEW"
                    zIndex={2500}
                />

                {/* SECONDARY */}
                <Text style={globalStyles.NW_label}>Arma secundaria</Text>
                <DropDownPicker
                    open={openWeapon2}
                    value={weapon2}
                    items={secondaryWeapons}
                    setOpen={setOpenWeapon2}
                    setValue={setWeapon2}
                    setItems={setSecondaryWeapons}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    textStyle={{ color: "#888888", fontFamily: "Michroma" }}
                    placeholder="Selecciona un arma"
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
                            placeholder="0"
                            placeholderTextColor="#aaa"
                            value={kills}
                            onChangeText={setKills}
                        />
                    </View>

                    <View style={globalStyles.NW_numberInputWrap}>
                        <Text style={globalStyles.NW_smallLabel}>Muertes</Text>
                        <TextInput
                            style={globalStyles.NW_numberInput}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#aaa"
                            value={deaths}
                            onChangeText={setDeaths}
                        />
                    </View>
                </View>

                {/* RESULT */}
                <Text style={globalStyles.NW_label}>Resultado</Text>
                <DropDownPicker
                    open={openResult}
                    value={selectedResult}
                    items={results}
                    setOpen={setOpenResult}
                    setValue={setSelectedResult}
                    setItems={setResults}
                    style={globalStyles.NW_dropdown}
                    dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                    textStyle={{ color: "#888888", fontFamily: "Michroma" }}
                    placeholder="Selecciona un resultado"
                    listMode="SCROLLVIEW"
                    zIndex={1500}
                />

                {/* Save */}
                <TouchableOpacity
                    style={globalStyles.NW_primaryButton}
                    onPress={handleSave}
                >
                    <Text style={globalStyles.NW_primaryButtonText}>Guardar Partida</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
