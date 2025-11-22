// assets/screens/Home.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Image, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../components/globalStyles";
import { auth, db } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { LineChart } from "react-native-chart-kit";
import type { RootStackParamList } from "../../App";

type Match = {
  id: string;
  kills: number;
  deaths: number;
  weapon1: number;
  weapon2: number;
  fieldName: string;
  score: number;
  result: string;
  createdAt: Timestamp;
};

const HomeScreen = ({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">) => {
  const [lastMatches, setLastMatches] = useState<Match[]>([]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "games"), orderBy("createdAt", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Match[] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Match[];
      setLastMatches(data.reverse());
    });
    return unsubscribe;
  }, []);

  const screenWidth = Dimensions.get("window").width - 20;

  const chartLabels = lastMatches.map((_, index) => `Partida ${index + 1}`);

  return (
    <SafeAreaView style={[globalStyles.container, { backgroundColor: "#000", paddingTop: 120, paddingHorizontal: 10 }]}>
      {/* HEADER + LOGO */}
      <View style={[globalStyles.HM_header, { top: 0, left: 0 }]}>
        <Image
          source={require("../images/logo.png")}
          style={globalStyles.HM_logo}
          resizeMode="contain"
        />
      </View>

      {/* Título */}
      <Text style={globalStyles.HM_title}>Estadísticas Recientes</Text>

      {/* Gráfico */}
      {lastMatches.length > 0 ? (
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [
              { data: lastMatches.map((m) => m.kills), color: () => "#00ff00", strokeWidth: 3 },
              { data: lastMatches.map((m) => m.deaths), color: () => "#ff0000", strokeWidth: 3 },
            ],
            legend: ["Kills", "Bajas"],
          }}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#1b1b1bff",
            backgroundGradientTo: "#1a1a1a",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            labelColor: () => "#fff",
            style: { borderRadius: 16, borderWidth: 1, borderColor: "#FFA500" },
            propsForDots: { r: "4", strokeWidth: "2", stroke: "#fff" },
          }}
          bezier
          style={globalStyles.HM_chart}
        />
      ) : (
        <Text style={globalStyles.HM_noData}>Añade partidas para ver tus estadísticas.</Text>
      )}

      {/* Historial */}
      <Text style={globalStyles.HM_subtitle}>Historial de Partidas</Text>
      {lastMatches.length > 0 && (
        <View style={[globalStyles.HM_table]}>
          {/* Encabezado */}
          <View style={[globalStyles.HM_tableRow, globalStyles.HM_tableHeader]}>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Partida</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Campo</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Arma 1</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Arma 2</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Resultado</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Puntos</Text>
          </View>

          {/* Datos */}
          {lastMatches.map((m, index) => (
            <View key={m.id} style={[globalStyles.HM_tableRow, { backgroundColor: "#1b1b1bff" }]}>
              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>{index + 1}</Text>
              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>{m.fieldName}</Text>
              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>{m.weapon1}</Text>
              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>{m.weapon2}</Text>
              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>{m.result}</Text>
              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>{m.score}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Botón flotante */}
      <TouchableOpacity
        style={globalStyles.HM_floatingButton}
        onPress={() => navigation.navigate("NewGame")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomeScreen;
