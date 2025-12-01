import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import Toast from 'react-native-toast-message';
import type { RootStackParamList } from '../../App';

import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";

const NewGame = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'NewGame'>) => {

    // --- Estados generales ---
    const [fieldName, setFieldName] = useState('');
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);
    const [kills, setKills] = useState('');
    const [deaths, setDeaths] = useState('');

    // --- Modo de juego ---
    const [openMode, setOpenMode] = useState(false);
    const [gameMode, setGameMode] = useState(null);
    const [gameModes, setGameModes] = useState<any[]>([]);

    // --- Arma principal ---
    const [openWeapon1, setOpenWeapon1] = useState(false);
    const [primaryWeapons, setPrimaryWeapons] = useState<any[]>([]);
    const [weapon1, setWeapon1] = useState(null);

    // --- Arma secundaria ---
    const [openWeapon2, setOpenWeapon2] = useState(false);
    const [secondaryWeapons, setSecondaryWeapons] = useState<any[]>([]);
    const [weapon2, setWeapon2] = useState(null);

    // --- Resultado ---
    const [openResult, setOpenResult] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [selectedResult, setSelectedResult] = useState(null);

    // --- Cargar datos desde Firestore ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // --- Modo de juego ---
                const qMode = query(
                    collection(db, "master"),
                    where("master_type", "==", "game_mode")
                );
                const queryModes = await getDocs(qMode);
                const modes: any[] = [];
                queryModes.forEach(doc => {
                    const data = doc.data();
                    if (data.name && data.name.trim() !== "" && !data.master_father) {
                        modes.push({ label: data.name, value: data.id || data.name });
                    }
                });
                setGameModes(modes);

                // --- Armas principales ---
                const q1 = query(
                    collection(db, "master"),
                    where("master_type", "==", "guns"),
                    where("value1", "==", "primaryGun")
                );
                const querySnapshot1 = await getDocs(q1);
                const primary = querySnapshot1.docs
                    .map(doc => doc.data())
                    .filter(item => item.name && item.name.trim() !== "")
                    .map(item => ({ label: item.name, value: item.id || item.name }));
                setPrimaryWeapons(primary);

                // --- Armas secundarias ---
                const q2 = query(
                    collection(db, "master"),
                    where("master_type", "==", "guns"),
                    where("value1", "==", "secondaryGun")
                );
                const querySnapshot2 = await getDocs(q2);
                const secondary = querySnapshot2.docs
                    .map(doc => doc.data())
                    .filter(item => item.name && item.name.trim() !== "")
                    .map(item => ({ label: item.name, value: item.id || item.name }));
                setSecondaryWeapons(secondary);

                // --- Resultados ---
                const qResult = query(
                    collection(db, "master"),
                    where("master_type", "==", "results"),
                );
                const querySnapshotResult = await getDocs(qResult);
                const res = querySnapshotResult.docs
                    .map(doc => doc.data())
                    .filter(item => item.name && item.name.trim() !== "")
                    .map(item => ({ label: item.name, value: item.id || item.name }));
                setResults(res);

            } catch (error) {
                console.error("Error al cargar datos:", error);
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'No se pudieron cargar datos desde Firestore',
                    visibilityTime: 3000,
                });
            }
        };

        fetchData();
    }, []);

    // --- Guardar la partida con score ---
    const handleSave = async () => {
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'La fecha no puede ser futura.',
                visibilityTime: 3000,
            });
            return;
        }

        if (!fieldName || !gameMode || !weapon1 || !weapon2 || !kills || !deaths || !selectedResult) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Completa todos los campos.',
                visibilityTime: 3000,
            });
            return;
        }

        try {
            const auth = getAuth();
            const userId = auth.currentUser?.uid;

            if (!userId) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Usuario no autenticado.',
                });
                return;
            }

            // --- Llamada a la API local ---
            const response = await fetch('http://10.0.2.2:3000/calculateScore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kills: Number(kills),
                    deaths: Number(deaths),
                    result: selectedResult
                })
            });

            if (!response.ok) throw new Error('Error al calcular el score');

            const data = await response.json();
            const score = data.score;

            // --- Guardar partida en Firestore ---
            await addDoc(collection(db, "games"), {
                userId,
                fieldName,
                gameMode,
                weapon1,
                weapon2,
                kills: Number(kills),
                deaths: Number(deaths),
                result: selectedResult,
                score,
                delete_at: null,
                delete_mark: 'N',
                matchDate: selectedDate,
                createdAt: serverTimestamp(), // FIX CRÍTICO
            });

            Toast.show({
                type: 'success',
                text1: 'Éxito',
                text2: 'Partida guardada correctamente.',
                visibilityTime: 3000,
            });

            navigation.goBack();

        } catch (error) {
            console.error("Error al guardar partida:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudo guardar la partida.',
                visibilityTime: 3000,
            });
        }
    };

    return (
        <SafeAreaView style={globalStyles.NW_container}>
            <Text style={globalStyles.NW_title}>Nueva Partida</Text>

            <TextInput
                placeholder="Campo de juego"
                placeholderTextColor="#ccc"
                value={fieldName}
                onChangeText={setFieldName}
                style={globalStyles.NW_input}
            />

            {/* DATE PICKER */}
            <Text style={globalStyles.NW_label}>Fecha de la partida</Text>
            <View style={globalStyles.NW_pickerContainer}>
                <Picker style={globalStyles.NW_picker} selectedValue={day} onValueChange={setDay}>
                    {Array.from({ length: 31 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>
                <Picker style={globalStyles.NW_picker} selectedValue={month} onValueChange={setMonth}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>
                <Picker style={globalStyles.NW_picker} selectedValue={year} onValueChange={setYear}>
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
                placeholder="Selecciona un modo de juego"
                style={globalStyles.NW_dropdown}
                dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                textStyle={globalStyles.NW_dropdownText}
                onOpen={() => { setOpenWeapon1(false); setOpenWeapon2(false); setOpenResult(false); }}
                zIndex={4000}
                zIndexInverse={4000}
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
                placeholder="Selecciona un arma"
                style={globalStyles.NW_dropdown}
                dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                textStyle={globalStyles.NW_dropdownText}
                onOpen={() => { setOpenMode(false); setOpenWeapon2(false); setOpenResult(false); }}
                zIndex={3000}
                zIndexInverse={1000}
            />

            {/* SECONDARY WEAPON */}
            <Text style={globalStyles.NW_label}>Arma secundaria</Text>
            <DropDownPicker
                open={openWeapon2}
                value={weapon2}
                items={secondaryWeapons}
                setOpen={setOpenWeapon2}
                setValue={setWeapon2}
                setItems={setSecondaryWeapons}
                placeholder="Selecciona un arma"
                style={globalStyles.NW_dropdown}
                dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                textStyle={globalStyles.NW_dropdownText}
                onOpen={() => { setOpenMode(false); setOpenWeapon1(false); setOpenResult(false); }}
                zIndex={2000}
                zIndexInverse={2000}
            />

            {/* KILLS & DEATHS */}
            <View style={globalStyles.NW_rowContainer}>
                <View style={globalStyles.NW_numberInputContainer}>
                    <Text style={globalStyles.NW_smallLabel}>Kills</Text>
                    <TextInput
                        style={globalStyles.NW_numberInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#ccc"
                        value={kills}
                        onChangeText={setKills}
                    />
                </View>

                <View style={globalStyles.NW_numberInputContainer}>
                    <Text style={globalStyles.NW_smallLabel}>Muertes</Text>
                    <TextInput
                        style={globalStyles.NW_numberInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#ccc"
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
                items={results}
                setOpen={setOpenResult}
                setValue={setSelectedResult}
                setItems={setResults}
                placeholder="Selecciona un resultado"
                style={globalStyles.NW_dropdown}
                dropDownContainerStyle={globalStyles.NW_dropdownContainer}
                textStyle={globalStyles.NW_dropdownText}
                onOpen={() => { setOpenMode(false); setOpenWeapon1(false); setOpenWeapon2(false); }}
                zIndex={1000}
                zIndexInverse={1000}
            />

            <TouchableOpacity style={globalStyles.NW_primaryButton} onPress={handleSave}>
                <Text style={globalStyles.NW_primaryButtonText}>Guardar Partida</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default NewGame;
