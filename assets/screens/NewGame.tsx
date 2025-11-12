import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import type { RootStackParamList } from '../../App';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const NewGame = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'NewGame'>) => {
    const [gameMode, setGameMode] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);
    const [weapon1, setWeapon1] = useState(null);
    const [weapon2, setWeapon2] = useState(null);
    const [playTime, setPlayTime] = useState('');
    const [kills, setKills] = useState('');
    const [deaths, setDeaths] = useState('');

    const [openWeapon1, setOpenWeapon1] = useState(false);
    const [primaryWeapons, setPrimaryWeapons] = useState<any[]>([]);

    const [openWeapon2, setOpenWeapon2] = useState(false);
    const [secondaryWeapons, setSecondaryWeapons] = useState<any[]>([]);

    // Cargar armas principales y secundarias desde Firestore
    useEffect(() => {
        const fetchWeapons = async () => {
            try {
                // Primary Guns
                const q1 = query(
                    collection(db, "master"),
                    where("master_type", "==", "guns"),
                    where("value1", "==", "primaryGun")
                );
                const querySnapshot1 = await getDocs(q1);
                const primary: any[] = [];
                querySnapshot1.forEach(doc => {
                    const data = doc.data();
                    primary.push({ label: data.name ?? "Sin nombre", value: data.name ?? "" });
                });
                setPrimaryWeapons(primary);

                // Secondary Guns
                const q2 = query(
                    collection(db, "master"),
                    where("master_type", "==", "guns"),
                    where("value1", "==", "secondaryGun")
                );
                const querySnapshot2 = await getDocs(q2);
                const secondary: any[] = [];
                querySnapshot2.forEach(doc => {
                    const data = doc.data();
                    secondary.push({ label: data.name ?? "Sin nombre", value: data.name ?? "" });
                });
                setSecondaryWeapons(secondary);

            } catch (error) {
                console.error("Error al cargar armas:", error);
                Alert.alert("Error", "No se pudieron cargar las armas desde Firestore");
            }
        };
        fetchWeapons();
    }, []);

    const handleSave = () => {
        const selectedDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            Alert.alert('Error', 'No puedes seleccionar una fecha futura.');
            return;
        }

        if (!gameMode || !fieldName) {
            Alert.alert("Error", "Por favor, completa los campos obligatorios");
            return;
        }

        const formattedDate = selectedDate.toLocaleDateString('es-ES');

        console.log({
            gameMode,
            fieldName,
            date: formattedDate,
            weapon1,
            weapon2,
            playTime,
            kills,
            deaths
        });

        Alert.alert("Éxito", "Datos de partida guardados (por ahora solo en consola)");
    };

    return (
        <SafeAreaView style={globalStyles.NG_container}>
            <Text style={globalStyles.NG_title}>Nueva Partida</Text>

            <TextInput
                placeholder="Modo de juego"
                placeholderTextColor="#ccc"
                value={gameMode}
                onChangeText={setGameMode}
                style={globalStyles.NG_input}
            />

            <TextInput
                placeholder="Campo de juego"
                placeholderTextColor="#ccc"
                value={fieldName}
                onChangeText={setFieldName}
                style={globalStyles.NG_input}
            />

            <Text style={globalStyles.NG_label}>Fecha de la partida</Text>
            <View style={globalStyles.NG_pickerContainer}>
                <Picker
                    style={globalStyles.NG_picker}
                    selectedValue={day}
                    onValueChange={setDay}
                >
                    {Array.from({ length: 31 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>
                <Picker
                    style={globalStyles.NG_picker}
                    selectedValue={month}
                    onValueChange={setMonth}
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                    ))}
                </Picker>
                <Picker
                    style={globalStyles.NG_picker}
                    selectedValue={year}
                    onValueChange={setYear}
                >
                    {Array.from({ length: 5 }, (_, i) => (
                        <Picker.Item key={i} label={`${2025 - i}`} value={2025 - i} />
                    ))}
                </Picker>
            </View>

            <Text style={globalStyles.NG_label}>Arma principal</Text>
            <DropDownPicker
                open={openWeapon1}
                value={weapon1}
                items={primaryWeapons}
                setOpen={setOpenWeapon1}
                setValue={setWeapon1}
                setItems={setPrimaryWeapons}
                placeholder="Selecciona un arma"
                style={globalStyles.NG_dropdown}
                dropDownContainerStyle={globalStyles.NG_dropdownContainer}
                textStyle={globalStyles.NG_dropdownText}
                onOpen={() => setOpenWeapon2(false)}
                zIndex={3000}
                zIndexInverse={1000}
            />

            <Text style={globalStyles.NG_label}>Arma secundaria</Text>
            <DropDownPicker
                open={openWeapon2}
                value={weapon2}
                items={secondaryWeapons}
                setOpen={setOpenWeapon2}
                setValue={setWeapon2}
                setItems={setSecondaryWeapons}
                placeholder="Selecciona un arma"
                style={globalStyles.NG_dropdown}
                dropDownContainerStyle={globalStyles.NG_dropdownContainer}
                textStyle={globalStyles.NG_dropdownText}
                onOpen={() => setOpenWeapon1(false)}
                zIndex={2000}
                zIndexInverse={2000}
            />

            <TextInput
                placeholder="Tiempo de juego (minutos)"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={playTime}
                onChangeText={setPlayTime}
                style={globalStyles.NG_input}
            />

            <View style={globalStyles.NG_rowContainer}>
                <View style={globalStyles.NG_numberInputContainer}>
                    <Text style={globalStyles.NG_smallLabel}>Kills</Text>
                    <TextInput
                        style={globalStyles.NG_numberInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#ccc"
                        value={kills}
                        onChangeText={setKills}
                    />
                </View>

                <View style={globalStyles.NG_numberInputContainer}>
                    <Text style={globalStyles.NG_smallLabel}>Muertes</Text>
                    <TextInput
                        style={globalStyles.NG_numberInput}
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#ccc"
                        value={deaths}
                        onChangeText={setDeaths}
                    />
                </View>
            </View>

            <TouchableOpacity style={globalStyles.primaryButton} onPress={handleSave}>
                <Text style={globalStyles.primaryButtonText}>Guardar Partida</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default NewGame;
