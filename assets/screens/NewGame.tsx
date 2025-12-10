// assets/screens/NewGame.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { collection, getDocs, query, where, addDoc, serverTimestamp, Timestamp, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { globalStyles } from "../components/globalStyles";

type Option = { label: string; value: string };

export default function NewGame({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'NewGame'>) {

    // ----- Recibir campo desde el mapa -----
    const preselectedField = route?.params?.fieldName ?? "";

    // Inputs
    const [fieldName, setFieldName] = useState(preselectedField);

    // Bloquear edición si viene del mapa
    const fieldLocked = preselectedField !== "";

    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);
    const [kills, setKills] = useState('');
    const [deaths, setDeaths] = useState('');

    // dropdowns
    const [openMode, setOpenMode] = useState(false);
    const [gameMode, setGameMode] = useState<string | null>(null);
    const [gameModes, setGameModes] = useState<Option[]>([]);

    const [openWeapon1, setOpenWeapon1] = useState(false);
    const [primaryWeapons, setPrimaryWeapons] = useState<Option[]>([]);
    const [weapon1, setWeapon1] = useState<string | null>(null);

    const [openWeapon2, setOpenWeapon2] = useState(false);
    const [secondaryWeapons, setSecondaryWeapons] = useState<Option[]>([]);
    const [weapon2, setWeapon2] = useState<string | null>(null);

    const [openResult, setOpenResult] = useState(false);
    const [results, setResults] = useState<Option[]>([]);
    const [selectedResult, setSelectedResult] = useState<string | null>(null);

    // --- cargar catálogos ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const qMode = query(collection(db, "master"), where("master_type", "==", "game_mode"));
                const snapMode = await getDocs(qMode);
                setGameModes(snapMode.docs.map(d => ({ label: d.data().name, value: d.id })));

                const q1 = query(collection(db, "master"), where("master_type", "==", "guns"), where("value1", "==", "primaryGun"));
                const snap1 = await getDocs(q1);
                setPrimaryWeapons(snap1.docs.map(d => ({ label: d.data().name, value: d.id })));

                const q2 = query(collection(db, "master"), where("master_type", "==", "guns"), where("value1", "==", "secondaryGun"));
                const snap2 = await getDocs(q2);
                setSecondaryWeapons(snap2.docs.map(d => ({ label: d.data().name, value: d.id })));

                const qRes = query(collection(db, "master"), where("master_type", "==", "results"));
                const snapRes = await getDocs(qRes);
                setResults(snapRes.docs.map(d => ({ label: d.data().name, value: d.id })));

            } catch (e) {
                Toast.show({ type: "error", text1: "Error cargando datos" });
            }
        };
        fetchData();
    }, []);

    // Guardar partida
    const handleSave = async () => {
        if (!fieldName || !kills || !deaths || !weapon1 || !weapon2 || !gameMode || !selectedResult) {
            return Toast.show({ type: "error", text1: "Completa todos los campos." });
        }

        const selectedDate = new Date(year, month - 1, day);
        if (selectedDate > new Date()) {
            return Toast.show({ type: "error", text1: "Fecha incorrecta" });
        }

        const userId = getAuth().currentUser?.uid;
        if (!userId) return Toast.show({ type: "error", text1: "Usuario no autenticado." });

        try {
            // obtener username
            const userDoc = await getDoc(doc(db, "users", userId));
            const username =
                userDoc.exists()
                    ? (userDoc.data().USERNAME || userDoc.data().NAME || null)
                    : null;

            // score
            const response = await fetch("http://10.0.2.2:3000/calculateScore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ kills: Number(kills), deaths: Number(deaths), result: selectedResult })
            });
            const { score } = await response.json();

            // guardar en firestore
            await addDoc(collection(db, "games"), {
                uid: userId,
                username: username || null,
                fieldName,
                gameMode,
                weapon1,
                weapon2,
                kills: Number(kills),
                deaths: Number(deaths),
                result: selectedResult,
                score,
                matchDate: Timestamp.fromDate(selectedDate),
                createdAt: serverTimestamp(),
                delete_mark: "N",
                delete_at: null,
            });

            Toast.show({ type: "success", text1: "Partida guardada" });
            navigation.goBack();

        } catch (e) {
            Toast.show({ type: "error", text1: "Error al guardar" });
        }
    };

    return (
        <SafeAreaView style={globalStyles.NW_container}>
            <Text style={globalStyles.NW_title}>Nueva Partida</Text>

            {/* Campo de juego (bloqueado si viene del mapa) */}
            <TextInput
                style={[
                    globalStyles.NW_input,
                    fieldLocked && { opacity: 0.5 } // efecto visual
                ]}
                placeholder="Campo de juego"
                placeholderTextColor="#ccc"
                value={fieldName}
                onChangeText={fieldLocked ? undefined : setFieldName}
                editable={!fieldLocked}
            />

            {/* Fecha */}
            <Text style={globalStyles.NW_label}>Fecha</Text>
            <View style={globalStyles.NW_pickerContainer}>
                <Picker selectedValue={day} onValueChange={setDay} style={globalStyles.NW_picker}>
                    {Array.from({ length: 31 }, (_, i) => <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />)}
                </Picker>
                <Picker selectedValue={month} onValueChange={setMonth} style={globalStyles.NW_picker}>
                    {Array.from({ length: 12 }, (_, i) => <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />)}
                </Picker>
                <Picker selectedValue={year} onValueChange={setYear} style={globalStyles.NW_picker}>
                    {Array.from({ length: 5 }, (_, i) => <Picker.Item key={i} label={`${2025 - i}`} value={2025 - i} />)}
                </Picker>
            </View>

            {/* Dropdowns */}
            <Text style={globalStyles.NW_label}>Modo de juego</Text>
            <DropDownPicker open={openMode} value={gameMode} items={gameModes} setOpen={setOpenMode} setValue={setGameMode as any} setItems={setGameModes as any} style={globalStyles.NW_dropdown} dropDownContainerStyle={globalStyles.NW_dropdownContainer} placeholder="Selecciona un modo" />

            <Text style={globalStyles.NW_label}>Arma principal</Text>
            <DropDownPicker open={openWeapon1} value={weapon1} items={primaryWeapons} setOpen={setOpenWeapon1} setValue={setWeapon1 as any} setItems={setPrimaryWeapons as any} placeholder="Selecciona un arma" style={globalStyles.NW_dropdown} dropDownContainerStyle={globalStyles.NW_dropdownContainer} />

            <Text style={globalStyles.NW_label}>Arma secundaria</Text>
            <DropDownPicker open={openWeapon2} value={weapon2} items={secondaryWeapons} setOpen={setOpenWeapon2} setValue={setWeapon2 as any} setItems={setSecondaryWeapons as any} placeholder="Selecciona un arma" style={globalStyles.NW_dropdown} dropDownContainerStyle={globalStyles.NW_dropdownContainer} />

            {/* Stats */}
            <View style={globalStyles.NW_rowContainer}>
                <View style={globalStyles.NW_numberInputContainer}>
                    <Text style={globalStyles.NW_smallLabel}>Kills</Text>
                    <TextInput style={globalStyles.NW_numberInput} keyboardType="numeric" placeholder="0" placeholderTextColor="#ccc" value={kills} onChangeText={setKills} />
                </View>

                <View style={globalStyles.NW_numberInputContainer}>
                    <Text style={globalStyles.NW_smallLabel}>Muertes</Text>
                    <TextInput style={globalStyles.NW_numberInput} keyboardType="numeric" placeholder="0" placeholderTextColor="#ccc" value={deaths} onChangeText={setDeaths} />
                </View>
            </View>

            {/* Result */}
            <Text style={globalStyles.NW_label}>Resultado</Text>
            <DropDownPicker open={openResult} value={selectedResult} items={results} setOpen={setOpenResult} setValue={setSelectedResult as any} setItems={setResults as any} placeholder="Selecciona un resultado" style={globalStyles.NW_dropdown} dropDownContainerStyle={globalStyles.NW_dropdownContainer} />

            {/* Guardar */}
            <TouchableOpacity style={globalStyles.NW_primaryButton} onPress={handleSave}>
                <Text style={globalStyles.NW_primaryButtonText}>Guardar Partida</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
