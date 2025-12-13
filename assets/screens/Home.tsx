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
  ScrollView,
  BackHandler
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
  Timestamp, doc, getDoc
} from "firebase/firestore";

import { LineChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { useMaster } from "../hooks/useMaster";
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
  gameMode: string;
  matchDate: Timestamp;
};

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Home">) {

  const [lastMatches, setLastMatches] = useState<Match[]>([]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const master = useMaster();

  // ----------------- MENÚ -----------------
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const loadProfilePic = async () => {
        try {
          const snap = await getDoc(doc(db, "game_profile", uid));
          if (snap.exists()) {
            setProfilePic(snap.data().PROFILE_PIC_URL ?? null);
          }
        } catch (e) {
          console.log("Error cargando foto de perfil:", e);
        }
      };

      loadProfilePic();
    }, [])
  );



  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) navigation.replace("Login");
    });
    return unsub;
  }, []);

  // ----------------- CARGAR ÚLTIMAS PARTIDAS -----------------
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

    const unsub = onSnapshot(q, (snapshot) => {
      const data: Match[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Match[];

      setLastMatches(data.reverse());
    });

    return unsub;
  }, []);

  const screenWidth = Dimensions.get("window").width - 20;
  const chartLabels = lastMatches.map((_, i) => `Partida ${i + 1}`);

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

  // ----------------- LOGOUT -----------------
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.log("Error al cerrar sesión:", error);
    }
  };

  // ----------------- UI -----------------
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

      {/* MENÚ LATERAL */}
      <Animated.View
        style={[globalStyles.HM_menuContainer, { left: slideAnim }]}
      >
        <Image
          source={
            profilePic
              ? { uri: profilePic }
              : require("../images/default_profile.png")
          }
          style={globalStyles.HM_menuProfile}
        />


        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={() => navigateTo("Profile")}>
          <Ionicons name="person-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={() => navigateTo("NewGame")}>
          <Ionicons name="add-circle-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Nueva Partida</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={() => navigateTo("History")}>
          <Ionicons name="document-text-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Historial</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={() => navigateTo("Map")}>
          <Ionicons name="map-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.HM_menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#ff8800" />
          <Text style={globalStyles.HM_menuText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ESTADÍSTICAS */}
      <Text style={globalStyles.HM_title}>Estadísticas Recientes</Text>

      {lastMatches.length > 0 ? (
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [
              { data: lastMatches.map((m) => m.kills), color: () => "#FF8800", strokeWidth: 3 },
              { data: lastMatches.map((m) => m.deaths), color: () => "#ff0000", strokeWidth: 3 },
            ],
            legend: ["Kills", "Muertes"],
          }}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#1b1b1b",
            backgroundGradientTo: "#1a1a1a",
            decimalPlaces: 0,
            color: () => "#fff",
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

      {/* HISTORIAL RECIENTE */}
      <Text style={globalStyles.HM_subtitle}>Historial reciente</Text>

      {lastMatches.length === 0 ? (
        <Text style={globalStyles.HM_noData}>No hay partidas todavía.</Text>
      ) : (
        <ScrollView style={globalStyles.HM_recentScroll}>
          {lastMatches.map((m) => (
            <View key={m.id} style={globalStyles.HM_recentCard}>

              {/* HEADER */}
              <View style={globalStyles.HM_recentHeader}>
                <Text style={globalStyles.HM_recentDate}>
                  {m.matchDate?.toDate().toLocaleDateString("es-ES")}
                </Text>
                <Text style={globalStyles.HM_recentField}>{m.fieldName}</Text>
              </View>

              <Text style={globalStyles.HM_recentInfo}>
                Modo: {master.getName(m.gameMode)}
              </Text>

              <Text style={globalStyles.HM_recentInfo}>
                Armas: {master.getName(m.weapon1)} • {master.getName(m.weapon2)}
              </Text>

              <Text style={globalStyles.HM_recentInfo}>
                Kills: {m.kills} ‣ Muertes: {m.deaths}
              </Text>

              <View style={globalStyles.HM_recentFooter}>
                <Text
                  style={[
                    globalStyles.HM_recentResult,
                    master.getName(m.result) === "Victoria"
                      ? { color: "#4CAF50" }
                      : { color: "#FF5252" },
                  ]}
                >
                  {master.getName(m.result)}
                </Text>

                <Text style={{ color: "#FFA500", fontFamily: "Michroma" }}>
                  Puntos: {m.score}
                </Text>
              </View>

            </View>
          ))}
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
