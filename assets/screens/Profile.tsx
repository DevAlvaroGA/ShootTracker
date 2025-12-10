import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { globalStyles } from "../components/globalStyles";
import { auth, db } from "@/firebaseConfig";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
} from "firebase/firestore";

type Option = { label: string; value: string };

export default function ProfileScreen() {
    const uid = auth.currentUser?.uid;

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // USERNAME
    const [username, setUsername] = useState("");

    // GAME PROFILE FIELDS
    const [language, setLanguage] = useState("es");
    const [bio, setBio] = useState("");
    const BIO_LIMIT = 200;

    const [mainWeapon, setMainWeapon] = useState<string | null>(null);
    const [secondaryWeapon, setSecondaryWeapon] = useState<string | null>(null);
    const [favoriteMode, setFavoriteMode] = useState<string | null>(null);

    // DROPDOWN DATA
    const [primaryWeapons, setPrimaryWeapons] = useState<Option[]>([]);
    const [secondaryWeapons, setSecondaryWeapons] = useState<Option[]>([]);
    const [gameModes, setGameModes] = useState<Option[]>([]);

    // DROPDOWN OPEN STATES
    const [openMode, setOpenMode] = useState(false);
    const [openPrimary, setOpenPrimary] = useState(false);
    const [openSecondary, setOpenSecondary] = useState(false);

    // STATS
    const [totalPoints, setTotalPoints] = useState(0);
    const [victories, setVictories] = useState(0);
    const [matchesPlayed, setMatchesPlayed] = useState(0);

    const defaultProfile = require("../images/default_profile.png");

    // -------------------------------------------------------
    // LOAD DATA
    // -------------------------------------------------------
    useEffect(() => {
        const loadData = async () => {
            if (!uid) return;

            setLoading(true);

            // Load username
            const userSnap = await getDoc(doc(db, "users", uid));
            if (userSnap.exists()) {
                const u = userSnap.data();
                setUsername(u.USERNAME || "");
            }

            // Load game_profile (create if missing)
            const profileRef = doc(db, "game_profile", uid);
            const profileSnap = await getDoc(profileRef);

            if (!profileSnap.exists()) {
                await setDoc(profileRef, {
                    LANGUAGE: "es",
                    BIO: "",
                    MAIN_WEAPON: null,
                    SECONDARY_WEAPON: null,
                    FAVORITE_MODE: null,
                    DELETE_MARK: "N",
                });
            } else {
                const p = profileSnap.data();
                setLanguage(p.LANGUAGE || "es");
                setBio(p.BIO || "");
                setMainWeapon(p.MAIN_WEAPON || null);
                setSecondaryWeapon(p.SECONDARY_WEAPON || null);
                setFavoriteMode(p.FAVORITE_MODE || null);
            }

            await loadCatalogs();
            await loadStats(uid);

            setLoading(false);
        };

        loadData();
    }, []);

    // -------------------------------------------------------
    // LOAD CATALOGS (WEAPONS, MODES)
    // -------------------------------------------------------
    const loadCatalogs = async () => {
        // PRIMARY GUNS
        const q1 = query(
            collection(db, "master"),
            where("master_type", "==", "guns"),
            where("value1", "==", "primaryGun")
        );

        const snap1 = await getDocs(q1);
        setPrimaryWeapons(
            snap1.docs.map((d) => ({
                label: d.data().name,
                value: d.id,
            }))
        );

        // SECONDARY GUNS
        const q2 = query(
            collection(db, "master"),
            where("master_type", "==", "guns"),
            where("value1", "==", "secondaryGun")
        );

        const snap2 = await getDocs(q2);
        setSecondaryWeapons(
            snap2.docs.map((d) => ({
                label: d.data().name,
                value: d.id,
            }))
        );

        // GAME MODES
        const qMode = query(
            collection(db, "master"),
            where("master_type", "==", "game_mode")
        );

        const snapMode = await getDocs(qMode);
        setGameModes(
            snapMode.docs.map((d) => ({
                label: d.data().name,
                value: d.id,
            }))
        );
    };

    // -------------------------------------------------------
    // LOAD STATS
    // -------------------------------------------------------
    const loadStats = async (uid: string) => {
        const qGames = query(
            collection(db, "games"),
            where("delete_mark", "==", "N"),
            where("uid", "==", uid)
        );

        const snap = await getDocs(qGames);

        let pts = 0;
        let wins = 0;

        snap.forEach((g) => {
            pts += g.data().score || 0;
            if (g.data().result === "Victoria") wins++;
        });

        setMatchesPlayed(snap.size);
        setVictories(wins);
        setTotalPoints(pts);
    };

    // -------------------------------------------------------
    // SAVE PROFILE
    // -------------------------------------------------------
    const saveProfile = async () => {
        if (!username.trim()) {
            Toast.show({ type: "error", text1: "Nickname inválido" });
            return;
        }

        if (bio.length > BIO_LIMIT) {
            Toast.show({ type: "error", text1: "Bio demasiado larga" });
            return;
        }

        try {
            // Update USERS table
            await updateDoc(doc(db, "users", uid!), {
                USERNAME: username.trim(),
            });

            // Update GAME_PROFILE
            await updateDoc(doc(db, "game_profile", uid!), {
                LANGUAGE: language,
                BIO: bio,
                MAIN_WEAPON: mainWeapon,
                SECONDARY_WEAPON: secondaryWeapon,
                FAVORITE_MODE: favoriteMode,
            });

            Toast.show({ type: "success", text1: "Perfil actualizado" });
            setEditing(false);
        } catch (error) {
            Toast.show({ type: "error", text1: "Error al guardar" });
        }
    };

    // -------------------------------------------------------
    // LOADING
    // -------------------------------------------------------
    if (loading) {
        return (
            <View style={globalStyles.PRF_loading}>
                <ActivityIndicator size="large" color="#FFA500" />
            </View>
        );
    }

    // -------------------------------------------------------
    // UI
    // -------------------------------------------------------
    return (
        <KeyboardAwareScrollView
            style={globalStyles.PRF_container}
            extraScrollHeight={80}
            enableOnAndroid
        >
            {/* HEADER */}
            <View style={{ alignItems: "center", marginTop: 60 }}>
                <Image source={defaultProfile} style={globalStyles.PRF_profileImage} />

                {editing ? (
                    <TextInput
                        value={username}
                        onChangeText={setUsername}
                        style={globalStyles.PRF_usernameInput}
                    />
                ) : (
                    <Text style={globalStyles.PRF_username}>{username}</Text>
                )}

                {!editing && (
                    <TouchableOpacity
                        style={globalStyles.PRF_editButton}
                        onPress={() => setEditing(true)}
                    >
                        <Text style={globalStyles.PRF_editButtonText}>Editar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* INFO CARD */}
            <View style={globalStyles.PRF_infoCard}>
                {/* LANGUAGE */}
                <Text style={globalStyles.PRF_infoLabel}>Idioma</Text>
                {editing ? (
                    <View style={globalStyles.PRF_pickerWrapper}>
                        <Picker
                            selectedValue={language}
                            dropdownIconColor="#FFA500"
                            style={globalStyles.PRF_picker}
                            onValueChange={(v) => setLanguage(v)}
                        >
                            <Picker.Item label="Español" value="es" />
                            <Picker.Item label="Inglés" value="en" />
                        </Picker>
                    </View>
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>{language}</Text>
                )}

                {/* BIO */}
                <Text style={globalStyles.PRF_infoLabel}>
                    Biografía ({bio.length}/{BIO_LIMIT})
                </Text>

                {editing ? (
                    <TextInput
                        value={bio}
                        multiline
                        onChangeText={(t) => t.length <= BIO_LIMIT && setBio(t)}
                        style={globalStyles.PRF_bioInput}
                    />
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>{bio}</Text>
                )}

                {/* MAIN WEAPON */}
                <Text style={globalStyles.PRF_infoLabel}>Arma principal</Text>
                {editing ? (
                    <DropDownPicker
                        open={openPrimary}
                        value={mainWeapon}
                        items={primaryWeapons}
                        setOpen={setOpenPrimary}
                        setValue={setMainWeapon}
                        setItems={setPrimaryWeapons}
                        onOpen={() => {
                            setOpenMode(false);
                            setOpenSecondary(false);
                        }}
                        placeholder="Selecciona un arma"
                        style={globalStyles.PRF_pickerWrapper}
                        dropDownContainerStyle={{ backgroundColor: "#222" }}
                        zIndex={3000}
                    />
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>
                        {mainWeapon || "No asignada"}
                    </Text>
                )}

                {/* SECONDARY WEAPON */}
                <Text style={globalStyles.PRF_infoLabel}>Arma secundaria</Text>
                {editing ? (
                    <DropDownPicker
                        open={openSecondary}
                        value={secondaryWeapon}
                        items={secondaryWeapons}
                        setOpen={setOpenSecondary}
                        setValue={setSecondaryWeapon}
                        setItems={setSecondaryWeapons}
                        onOpen={() => {
                            setOpenMode(false);
                            setOpenPrimary(false);
                        }}
                        placeholder="Selecciona un arma"
                        style={globalStyles.PRF_pickerWrapper}
                        dropDownContainerStyle={{ backgroundColor: "#222" }}
                        zIndex={2000}
                    />
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>
                        {secondaryWeapon || "No asignada"}
                    </Text>
                )}

                {/* GAME MODE */}
                <Text style={globalStyles.PRF_infoLabel}>
                    Modo de juego favorito
                </Text>

                {editing ? (
                    <DropDownPicker
                        open={openMode}
                        value={favoriteMode}
                        items={gameModes}
                        setOpen={setOpenMode}
                        setValue={setFavoriteMode}
                        setItems={setGameModes}
                        onOpen={() => {
                            setOpenPrimary(false);
                            setOpenSecondary(false);
                        }}
                        placeholder="Selecciona un modo"
                        style={globalStyles.PRF_pickerWrapper}
                        dropDownContainerStyle={{ backgroundColor: "#222" }}
                        zIndex={1000}
                    />
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>
                        {favoriteMode || "No asignado"}
                    </Text>
                )}
            </View>

            {/* STATS */}
            <View style={globalStyles.PRF_statsCard}>
                <Text style={globalStyles.PRF_statsText}>
                    Partidas jugadas: {matchesPlayed}
                </Text>
                <Text style={globalStyles.PRF_statsText}>
                    Victorias: {victories}
                </Text>
                <Text style={globalStyles.PRF_statsText}>
                    Puntos totales: {totalPoints}
                </Text>
            </View>

            {/* BUTTONS */}
            {editing && (
                <View style={globalStyles.PRF_buttonsRow}>
                    <TouchableOpacity
                        style={globalStyles.PRF_saveButton}
                        onPress={saveProfile}
                    >
                        <Text style={globalStyles.PRF_saveButtonText}>Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={globalStyles.PRF_cancelButton}
                        onPress={() => setEditing(false)}
                    >
                        <Text style={globalStyles.PRF_cancelButtonText}>
                            Cancelar
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAwareScrollView>
    );
}
