// assets/screens/History.tsx
import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { db } from "@/firebaseConfig";
import { collection, where, query, onSnapshot, orderBy } from "firebase/firestore";
import { globalStyles } from "../components/globalStyles";

type Match = {
    id: string;
    matchDate: any;
    fieldName: string;
    gameMode: string;
    weapon1: number;
    weapon2: number;
    deaths: number;
    kills: number;
    result: string;
    score: number;
    delete_mark?: string;
};

// -------- FORMATEAR FECHA ----------
const formatDate = (ts: any) => {
    if (!ts) return "";
    const d = ts.toDate?.() ?? new Date(ts.seconds * 1000);
    return d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
    });
};

export default function HistoryScreen() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    const [sortColumn, setSortColumn] = useState<keyof Match>("matchDate");
    const [sortDesc, setSortDesc] = useState(true);

    // -------- FIRESTORE --------
    useEffect(() => {
        const q = query(
            collection(db, "games"),
            where("delete_mark", "==", "N"),
            orderBy("matchDate", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Match[];
            setMatches(data);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    // -------- ORDENACIÓN --------
    const sortedMatches = useMemo(() => {
        return [...matches].sort((a, b) => {
            const A = a[sortColumn];
            const B = b[sortColumn];

            // Fecha (Timestamp)
            if (sortColumn === "matchDate") {
                const tA = A?.seconds ?? 0;
                const tB = B?.seconds ?? 0;
                return sortDesc ? tB - tA : tA - tB;
            }

            // Números (kills, score, etc.)
            if (typeof A === "number" && typeof B === "number") {
                return sortDesc ? B - A : A - B;
            }

            // Strings
            const sA = String(A).toUpperCase();
            const sB = String(B).toUpperCase();
            if (sA < sB) return sortDesc ? 1 : -1;
            if (sA > sB) return sortDesc ? -1 : 1;
            return 0;
        });
    }, [matches, sortColumn, sortDesc]);

    const toggleSortDir = () => setSortDesc(!sortDesc);

    // -------- TARJETA INDIVIDUAL --------
    const renderCard = ({ item }: { item: Match }) => (
        <View style={globalStyles.HST_card}>
            <View style={globalStyles.HST_cardHeader}>
                <Text style={globalStyles.HST_cardDate}>{formatDate(item.matchDate)}</Text>
                <Text style={globalStyles.HST_cardField}>{item.fieldName}</Text>
            </View>

            <Text style={globalStyles.HST_cardMode}>Modo: {item.gameMode}</Text>

            <Text style={globalStyles.HST_cardWeapons}>
                Armas: {item.weapon1} • {item.weapon2}
            </Text>

            <Text style={globalStyles.HST_cardStats}>
                Kills: <Text style={globalStyles.HST_highlight}>{item.kills}</Text>
                ‣ Muertes: <Text style={globalStyles.HST_highlight}>{item.deaths}</Text>
            </Text>

            <View style={globalStyles.HST_cardFooter}>
                <Text
                    style={[
                        globalStyles.HST_result,
                        item.result === "Victoria"
                            ? globalStyles.HST_win
                            : globalStyles.HST_lose,
                    ]}
                >
                    {item.result}
                </Text>

                <Text style={globalStyles.HST_points}>Puntos: {item.score}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={globalStyles.HST_loadingContainer}>
                <ActivityIndicator size="large" color="#FFA500" />
            </View>
        );
    }

    return (
        <View style={globalStyles.HST_container}>
            <Text style={globalStyles.HST_title}>Historial de Partidas</Text>

            {/* -------- SORT BAR -------- */}
            <View style={globalStyles.HST_sortBar}>

                {/* CAMPO A ORDENAR */}
                <View style={globalStyles.HST_pickerWrapper}>
                    <Picker
                        selectedValue={sortColumn}
                        dropdownIconColor="#FFA500"
                        mode="dropdown"
                        style={globalStyles.HST_picker}
                        onValueChange={(v) => setSortColumn(v)}
                    >
                        <Picker.Item label="Fecha" value="matchDate" />
                        <Picker.Item label="Campo" value="fieldName" />
                        <Picker.Item label="Modo" value="gameMode" />
                        <Picker.Item label="Kills" value="kills" />
                        <Picker.Item label="Muertes" value="deaths" />
                        <Picker.Item label="Puntos" value="score" />
                        <Picker.Item label="Resultado" value="result" />

                    </Picker>
                </View>

                {/* ASC / DESC */}
                <TouchableOpacity
                    onPress={toggleSortDir}
                    style={globalStyles.HST_sortButton}
                >
                    <Ionicons
                        name={sortDesc ? "caret-down" : "caret-up"}
                        size={20}
                        color="#FFA500"
                    />
                </TouchableOpacity>

            </View>

            {/* -------- LISTA -------- */}
            <FlatList
                data={sortedMatches}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                contentContainerStyle={{ paddingBottom: 50 }}
            />
        </View>
    );
}
