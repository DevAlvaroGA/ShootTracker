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

import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  Timestamp,
} from "firebase/firestore";

import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import type { RootStackParamList } from "../../App";

type Match = {
  id: string;
  kills: number;
  deaths: number;
  weapon1: string;
  weapon2: string;
  fieldName: string;
  score: number;
  result: string;
  createdAt: Timestamp;
};

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) {
  const [lastMatches, setLastMatches] = useState<Match[]>([]);
  const [masterMap, setMasterMap] = useState<{ [key: string]: string }>({});

  // MENU
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

  // Block back
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  // Auth session
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigation.replace("Login");
    });
    return unsub;
  }, []);

  // Load master catalog → dictionary
  useEffect(() => {
    const loadMaster = async () => {
      const snap = await getDocs(collection(db, "master"));
      const map: any = {};
      snap.docs.forEach((doc) => {
        const data = doc.data();
        if (data.name) map[doc.id] = data.name;
      });
      setMasterMap(map);
    };

    loadMaster();
  }, []);

  // Load last matches
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, "games"),
      where("uid", "==", uid),
      where("delete_mark", "==", "N"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Match[];
      setLastMatches(arr.reverse());
    });

    return unsub;
  }, []);

  const chartLabels = lastMatches.map((_, i) => `Partida ${i + 1}`);
  const screenWidth = Dimensions.get("window").width - 20;

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
    navigation.navigate(screen as any);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut(auth);
      navigation.replace("Login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <SafeAreaView
      style={[
        globalStyles.container,
        { backgroundColor: "#000", paddingTop: 120, paddingHorizontal: 10 },
      ]}
    >
      {/* HEADER */}
      <View style={globalStyles.HM_headerBar}>
        <View style={globalStyles.HM_headerLeft}>
          {!menuOpen && (
            <TouchableOpacity
              style={globalStyles.HM_menuButton}
              onPress={toggleMenu}
            >
              <Ionicons name="menu" size={32} color="#FF8800" />
            </TouchableOpacity>
          )}
        </View>

        <View style={globalStyles.HM_headerRight}>
          <Image
            source={require("../images/logo.png")}
            style={globalStyles.HM_headerLogo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* OVERLAY */}
      {menuOpen && (
        <TouchableOpacity
          style={globalStyles.HM_menuOverlay}
          onPress={toggleMenu}
        />
      )}

      {/* SIDE MENU */}
      <Animated.View
        style={[globalStyles.HM_menuContainer, { left: slideAnim }]}
      >
        <Image
          source={require("../images/default_profile.png")}
          style={globalStyles.HM_menuProfile}
        />

        <TouchableOpacity
          style={globalStyles.HM_menuItem}
          onPress={() => navigateTo("Profile")}
        >
          <Ionicons name="person-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.HM_menuItem}
          onPress={() => navigateTo("History")}
        >
          <Ionicons name="document-text-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.HM_menuItem}
          onPress={() => navigateTo("Map")}
        >
          <Ionicons name="map-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.HM_menuItem}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* STATS */}
      <Text style={globalStyles.HM_title}>Estadísticas Recientes</Text>

      {lastMatches.length > 0 ? (
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [
              {
                data: lastMatches.map((m) => m.kills),
                color: () => "#FF8800",
                strokeWidth: 3,
              },
              {
                data: lastMatches.map((m) => m.deaths),
                color: () => "#ff0000",
                strokeWidth: 3,
              },
            ],
            legend: ["Kills", "Bajas"],
          }}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#1b1b1bff",
            backgroundGradientTo: "#1a1a1a",
            decimalPlaces: 0,
            color: () => "#fff",
            labelColor: () => "#fff",
            style: {
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#FFA500",
            },
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#fff",
            },
          }}
          bezier
          style={globalStyles.HM_chart}
        />
      ) : (
        <Text style={globalStyles.HM_noData}>
          Añade partidas para ver tus estadísticas.
        </Text>
      )}

      {/* TABLE */}
      <Text style={globalStyles.HM_subtitle}>Historial de Partidas</Text>

      {lastMatches.length > 0 && (
        <View style={globalStyles.HM_table}>
          <View style={[globalStyles.HM_tableRow, globalStyles.HM_tableHeader]}>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Partida</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Campo</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Arma 1</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Arma 2</Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>
              Resultado
            </Text>
            <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>Puntos</Text>
          </View>

          {lastMatches.map((m, index) => (
            <View
              key={m.id}
              style={[
                globalStyles.HM_tableRow,
                { backgroundColor: "#1b1b1bff" },
              ]}
            >
              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>
                {index + 1}
              </Text>

              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>
                {m.fieldName}
              </Text>

              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>
                {masterMap[m.weapon1] || m.weapon1}
              </Text>

              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>
                {masterMap[m.weapon2] || m.weapon2}
              </Text>

              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>
                {masterMap[m.result] || m.result}
              </Text>

              <Text style={[globalStyles.HM_tableCell, { flex: 1 }]}>
                {m.score}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={globalStyles.HM_floatingButton}
        onPress={() => navigation.navigate("NewGame")}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
