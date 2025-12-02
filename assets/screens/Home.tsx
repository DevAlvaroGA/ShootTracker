// assets/screens/Home.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../components/globalStyles";
import { auth, db } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { LineChart } from "react-native-chart-kit";
import type { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  // --- MENÚ LATERAL ---
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0]; // ancho menú 250

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 250,
        useNativeDriver: false,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  };

  const navigateTo = (screen: keyof RootStackParamList) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  // --- LOGOUT ---
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("rememberUser");
      await AsyncStorage.removeItem("savedEmail");
      await AsyncStorage.removeItem("savedPassword");
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  // --- FIRESTORE ---
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
      
      {/* BOTÓN MENU */}
      <TouchableOpacity onPress={toggleMenu} style={{ position: 'absolute', top: 30, left: 10, zIndex: 60 }}>
        <Ionicons name="menu" size={32} color="#FFA500" />
      </TouchableOpacity>

      {/* HEADER + LOGO */}
      <View pointerEvents="none" style={[globalStyles.HM_header, { top: 0, left: 0 }]}>
        <Image
          source={require("../images/logo.png")}
          style={globalStyles.HM_logo}
          resizeMode="contain"
        />
      </View>

      {/* MENÚ LATERAL */}
      {menuOpen && (
        <TouchableOpacity style={globalStyles.HM_menuOverlay} onPress={toggleMenu} />
      )}
      <Animated.View style={[globalStyles.HM_menuContainer, { left: slideAnim }]}>
        <Image
          source={require("../images/default_profile.png")}
          style={globalStyles.HM_menuProfile}
        />
        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={() => navigateTo("History")}>
          <Ionicons name="document-text-outline" size={24} color="#fff" />
          <Text style={globalStyles.HM_menuText}>Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={() => navigateTo("Profile")}>
          <Ionicons name="person-outline" size={24} color="#fff" />
          <Text style={globalStyles.HM_menuText}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={() => navigateTo("Map")}>
          <Ionicons name="map-outline" size={24} color="#fff" />
          <Text style={globalStyles.HM_menuText}>Mapa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={globalStyles.HM_menuText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </Animated.View>

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
          <View style={[globalStyles.HM_tableRow, globalStyles.HM_tableHeader]}>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Partida</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Campo</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Arma 1</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Arma 2</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Resultado</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Puntos</Text>
          </View>
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
