import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground,
    ScrollView,
    Alert,
} from 'react-native';
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { globalStyles } from '../components/globalStyles';
import type { RootStackParamList } from '../../App';

const NewGame = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'NewGame'>) => {
    const [gameMode, setGameMode] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [weapon1, setWeapon1] = useState('');
    const [weapon2, setWeapon2] = useState('');
    const [playTime, setPlayTime] = useState('');
    const [kills, setKills] = useState('');
    const [deaths, setDeaths] = useState('');
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(2025);

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
        <SafeAreaView style={globalStyles.container}>
            <ImageBackground
                source={require('../images/fondo.png')}
                style={globalStyles.backgroundImageNG}
                resizeMode="cover"
            >
                {/* 📜 Scroll ajustado al 20% inferior */}
                <ScrollView
                    contentContainerStyle={[globalStyles.scrollContainer, { paddingTop: '60%' }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={globalStyles.title}>Nueva Partida</Text>

                    <TextInput
                        placeholder="Modo de juego"
                        placeholderTextColor="#ccc"
                        value={gameMode}
                        onChangeText={setGameMode}
                        style={globalStyles.inputNG}
                    />

                    <TextInput
                        placeholder="Campo de juego"
                        placeholderTextColor="#ccc"
                        value={fieldName}
                        onChangeText={setFieldName}
                        style={globalStyles.inputNG}
                    />

                    {/* 📅 Selector de fecha (alineado en una sola fila) */}
                    <Text style={{ color: "#888", marginTop: 10, marginBottom: 5 }}>Fecha de la partida</Text>
                    <View style={[globalStyles.pickerContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                        <View style={[globalStyles.pickerWrapper, { flex: 1, marginRight: 5 }]}>
                            <Picker
                                style={globalStyles.picker}
                                dropdownIconColor="#FF8800"
                                selectedValue={day}
                                onValueChange={setDay}
                            >
                                {Array.from({ length: 31 }, (_, i) => (
                                    <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                                ))}
                            </Picker>
                        </View>

                        <View style={[globalStyles.pickerWrapper, { flex: 1, marginHorizontal: 5 }]}>
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

                        <View style={[globalStyles.pickerWrapper, { flex: 1, marginLeft: 5 }]}>
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

                    <TextInput
                        placeholder="Arma principal"
                        placeholderTextColor="#ccc"
                        value={weapon1}
                        onChangeText={setWeapon1}
                        style={globalStyles.inputNG}
                    />

                    <TextInput
                        placeholder="Arma secundaria"
                        placeholderTextColor="#ccc"
                        value={weapon2}
                        onChangeText={setWeapon2}
                        style={globalStyles.inputNG}
                    />

                    <TextInput
                        placeholder="Tiempo de juego (minutos)"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={playTime}
                        onChangeText={setPlayTime}
                        style={globalStyles.inputNG}
                    />

                    <TextInput
                        placeholder="Kills"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={kills}
                        onChangeText={setKills}
                        style={globalStyles.inputNG}
                    />

                    <TextInput
                        placeholder="Muertes"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        value={deaths}
                        onChangeText={setDeaths}
                        style={globalStyles.inputNG}
                    />

                    <TouchableOpacity style={globalStyles.primaryButton} onPress={handleSave}>
                        <Text style={globalStyles.primaryButtonText}>Guardar Partida</Text>
                    </TouchableOpacity>
                </ScrollView>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default NewGame;
