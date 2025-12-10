// assets/screens/History.tsx
import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { db } from "@/firebaseConfig";
import { collection, where, query, onSnapshot, orderBy } from "firebase/firestore";
import { globalStyles } from "../components/globalStyles";

type Match = {
    id: string;
    matchDate?: any;
    fieldName?: string;
    gameMode?: string;
    weapon1?: string;
    weapon2?: string;
    deaths?: number;
    kills?: number;
    result?: string;
    score?: number;
    username?: string;
    delete_mark?: string;
};

const formatDate = (ts: any) => {
    if (!ts) return "";
    const d = ts.toDate?.() ?? new Date(ts.seconds * 1000);
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "2-digit" });
};

export default function HistoryScreen() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [sortColumn, setSortColumn] = useState<keyof Match>("matchDate");
    const [sortDesc, setSortDesc] = useState(true);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, "games"), where("delete_mark", "==", "N"), orderBy("matchDate", "desc"));

        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Match[];
            setMatches(data);
            setLoading(false);
        }, (err) => {
            // si falla por indice, capturamos y mostramos instrucción al usuario / dev
            setErrorMsg(err?.message || "Error cargando historial.");
            setLoading(false);
            console.error("History onSnapshot error:", err);
        });

        return () => unsub();
    }, []);

    const sortedMatches = useMemo(() => {
        return [...matches].sort((a, b) => {
            const A = a[sortColumn] as any;
            const B = b[sortColumn] as any;
            if (sortColumn === "matchDate") {
                const tA = A?.seconds ?? 0, tB = B?.seconds ?? 0;
                return sortDesc ? tB - tA : tA - tB;
            }
            if (typeof A === "number" && typeof B === "number") return sortDesc ? B - A : A - B;
            const sA = String(A || "").toUpperCase(), sB = String(B || "").toUpperCase();
            if (sA < sB) return sortDesc ? 1 : -1;
            if (sA > sB) return sortDesc ? -1 : 1;
            return 0;
        });
    }, [matches, sortColumn, sortDesc]);

    if (loading) return <View style={globalStyles.HST_loadingContainer}><ActivityIndicator size="large" color="#FFA500" /></View>;

    return (
        <View style={globalStyles.HST_container}>
            <Text style={globalStyles.HST_title}>Historial de Partidas</Text>

            {errorMsg ? (
                <View style={{ padding: 16 }}>
                    <Text style={{ color: "#fff", marginBottom: 8 }}>Error: {errorMsg}</Text>
                    <Text style={{ color: "#fff" }}>Probablemente falte un índice en Firestore. Abre la consola de Firebase &gt; Firestore &gt; Indexes y crea un índice compuesto para la colección <Text style={{ fontWeight: '700' }}>games</Text>: campo <Text style={{ fontWeight: '700' }}>delete_mark</Text> (ASC) y <Text style={{ fontWeight: '700' }}>matchDate</Text> (DESC).</Text>
                </View>
            ) : (
                <>
                    <View style={globalStyles.HST_sortBar}>
                        <View style={globalStyles.HST_pickerWrapper}>
                            <Picker selectedValue={sortColumn} dropdownIconColor="#FFA500" mode="dropdown" style={globalStyles.HST_picker} onValueChange={(v) => setSortColumn(v as any)}>
                                <Picker.Item label="Fecha" value="matchDate" />
                                <Picker.Item label="Campo" value="fieldName" />
                                <Picker.Item label="Modo" value="gameMode" />
                                <Picker.Item label="Kills" value="kills" />
                                <Picker.Item label="Muertes" value="deaths" />
                                <Picker.Item label="Puntos" value="score" />
                                <Picker.Item label="Resultado" value="result" />
                            </Picker>
                        </View>

                        <TouchableOpacity onPress={() => setSortDesc(!sortDesc)} style={globalStyles.HST_sortButton}>
                            <Ionicons name={sortDesc ? "caret-down" : "caret-up"} size={20} color="#FFA500" />
                        </TouchableOpacity>
                    </View>

                    {sortedMatches.length === 0 ? (
                        <View style={{ padding: 16 }}>
                            <Text style={{ color: "#fff" }}>No hay partidas todavía.</Text>
                        </View>
                    ) : (
                        <FlatList data={sortedMatches} keyExtractor={(i) => i.id} contentContainerStyle={{ paddingBottom: 50 }} renderItem={({ item }) => (
                            <View style={globalStyles.HST_card}>
                                <View style={globalStyles.HST_cardHeader}>
                                    <Text style={globalStyles.HST_cardDate}>{formatDate(item.matchDate)}</Text>
                                    <Text style={globalStyles.HST_cardField}>{item.fieldName}</Text>
                                </View>
                                <Text style={globalStyles.HST_cardMode}>Modo: {item.gameMode}</Text>
                                <Text style={globalStyles.HST_cardWeapons}>Armas: {item.weapon1} • {item.weapon2}</Text>
                                <Text style={globalStyles.HST_cardStats}>Kills: <Text style={globalStyles.HST_highlight}>{item.kills}</Text> ‣ Muertes: <Text style={globalStyles.HST_highlight}>{item.deaths}</Text></Text>
                                <View style={globalStyles.HST_cardFooter}>
                                    <Text style={[globalStyles.HST_result, item.result === "Victoria" ? globalStyles.HST_win : globalStyles.HST_lose]}>{item.result}</Text>
                                    <Text style={globalStyles.HST_points}>Puntos: {item.score}</Text>
                                </View>
                            </View>
                        )} />
                    )}
                </>
            )}
        </View>
    );
}
