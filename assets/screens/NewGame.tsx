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

import AsyncStorage from '@react-native-async-storage/async-storage';


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
                    if (data.name && data.name.trim() !== "") {
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
                const snapshot1 = await getDocs(q1);
                setPrimaryWeapons(
                    snapshot1.docs.map(doc => ({
                        label: doc.data().name,
                        value: doc.data().id || doc.data().name
                    }))
                );

                // --- Armas secundarias ---
                const q2 = query(
                    collection(db, "master"),
                    where("master_type", "==", "guns"),
                    where("value1", "==", "secondaryGun")
                );
                const snapshot2 = await getDocs(q2);
                setSecondaryWeapons(
                    snapshot2.docs.map(doc => ({
                        label: doc.data().name,
                        value: doc.data().id || doc.data().name
                    }))
                );

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
                Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudieron cargar los datos.' });
            }
        };

        fetchData();
    }, []);

    // --- Guardar partida ---
    const handleSave = async () => {
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            Toast.show({ type: 'error', text1: 'Fecha incorrecta', text2: 'La fecha no puede ser futura.' });
            return;
        }

        if (!fieldName || !gameMode || !weapon1 || !weapon2 || !kills || !deaths || !selectedResult) {
            Toast.show({ type: 'error', text1: 'Campos incompletos', text2: 'Rellena todos los campos.' });
            return;
        }

        try {
            const auth = getAuth();
            const userId = auth.currentUser?.uid;

            if (!userId) {
                Toast.show({ type: 'error', text1: 'Error', text2: 'Usuario no autenticado.' });
                return;
            }

            // Calcular score vía API
            const response = await fetch("http://10.0.2.2:3000/calculateScore", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    kills: Number(kills),
                    deaths: Number(deaths),
                    result: selectedResult
                }),
            });

            const { score } = await response.json();

            // --- Guardar partida (CORREGIDO: uid en vez de userId) ---
            await addDoc(collection(db, "games"), {
                uid: userId,
                fieldName,
                gameMode,
                weapon1,
                weapon2,
                kills: Number(kills),
                deaths: Number(deaths),
                result: selectedResult,
                score,
                delete_mark: "N",
                delete_at: null,
                matchDate: selectedDate,
                createdAt: serverTimestamp(),
            });

            Toast.show({ type: 'success', text1: 'Partida guardada' });
            navigation.goBack();

        } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo guardar la partida.' });
        }
    };

    return (
        <SafeAreaView style={globalStyles.NW_container}>
            <Text style={globalStyles.NW_title}>Nueva Partida</Text>

            {/* Campo */}
            <TextInput
                placeholder="Campo de juego"
                placeholderTextColor="#ccc"
                value={fieldName}
                onChangeText={setFieldName}
                style={globalStyles.NW_input}
            />

            {/* Fecha */}
            <Text style={globalStyles.NW_label}>Fecha de la partida</Text>
            <View style={globalStyles.NW_pickerContainer}>
                <Picker selectedValue={day} style={globalStyles.NW_picker} onValueChange={setDay}>
                    {Array.from({ length: 31 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>

                <Picker selectedValue={month} style={globalStyles.NW_picker} onValueChange={setMonth}>
                    {Array.from({ length: 12 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>

                <Picker selectedValue={year} style={globalStyles.NW_picker} onValueChange={setYear}>
                    {Array.from({ length: 5 }, (_, i) => (
                        <Picker.Item key={i} label={`${2025 - i}`} value={2025 - i} />
                    ))}
                </Picker>
            </View>

            {/* Modo de juego */}
            <Text style={globalStyles.NW_label}>Modo de juego</Text>
            <DropDownPicker
                open={openMode}
                value={gameMode}
                items={gameModes}
                setOpen={setOpenMode}
                setValue={setGameMode}
                setItems={setGameModes}
                placeholder="Selecciona un modo"
                style={globalStyles.NW_dropdown}
                dropDownContainerStyle={globalStyles.NW_dropdownContainer}
            />

            {/* Arma principal */}
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
            />

            {/* Arma secundaria */}
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
            />

            {/* Kills y Deaths */}
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

            {/* Resultado */}
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
            />

            {/* Botón Guardar */}
            <TouchableOpacity style={globalStyles.NW_primaryButton} onPress={handleSave}>
                <Text style={globalStyles.NW_primaryButtonText}>Guardar Partida</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

export default NewGame;
