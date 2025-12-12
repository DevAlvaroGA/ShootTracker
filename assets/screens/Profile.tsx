import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DropDownPicker from "react-native-dropdown-picker";

import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { globalStyles } from "../components/globalStyles";
import { auth, db } from "@/firebaseConfig";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    where,
    setDoc,
} from "firebase/firestore";

import { useMaster } from "../hooks/useMaster";

export default function ProfileScreen() {
    const uid = auth.currentUser?.uid;

    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    const [username, setUsername] = useState("");
    const [language, setLanguage] = useState("es");
    const [bio, setBio] = useState("");
    const BIO_LIMIT = 200;

    const [mainWeapon, setMainWeapon] = useState<string | null>(null);
    const [secondaryWeapon, setSecondaryWeapon] = useState<string | null>(null);
    const [favoriteMode, setFavoriteMode] = useState<string | null>(null);

    const [totalPoints, setTotalPoints] = useState(0);
    const [victories, setVictories] = useState(0);
    const [matchesPlayed, setMatchesPlayed] = useState(0);

    const [profilePic, setProfilePic] = useState<string | null>(null);

    // Dropdown states
    const [openLang, setOpenLang] = useState(false);
    const [openPrimary, setOpenPrimary] = useState(false);
    const [openSecondary, setOpenSecondary] = useState(false);
    const [openMode, setOpenMode] = useState(false);

    const master = useMaster();
    const defaultProfile = require("../images/default_profile.png");

    // ---------- VALIDACIÓN ----------
    const isUsernameTaken = async (name: string) => {
        const qName = query(collection(db, "users"), where("USERNAME", "==", name));
        const snap = await getDocs(qName);
        return snap.docs.some((d) => d.id !== uid);
    };

    // ---------- LOAD DATA ----------
    useEffect(() => {
        if (!uid) return;

        const loadEverything = async () => {
            setLoading(true);

            const userSnap = await getDoc(doc(db, "users", uid));
            const usernameValue = userSnap.exists() ? userSnap.data().USERNAME || "" : "";
            setUsername(usernameValue);

            const profileRef = doc(db, "game_profile", uid);
            const profileSnap = await getDoc(profileRef);

            if (!profileSnap.exists()) {
                await setDoc(
                    profileRef,
                    {
                        USERNAME: usernameValue,
                        LANGUAGE: "es",
                        BIO: "",
                        MAIN_WEAPON: null,
                        SECONDARY_WEAPON: null,
                        FAVORITE_MODE: null,
                        PROFILE_PIC_URL: null,
                        DELETE_MARK: "N",
                    },
                    { merge: true }
                );
            }

            if (profileSnap.exists()) {
                const p = profileSnap.data();
                setLanguage(p.LANGUAGE || "es");
                setBio(p.BIO || "");
                setMainWeapon(p.MAIN_WEAPON || null);
                setSecondaryWeapon(p.SECONDARY_WEAPON || null);
                setFavoriteMode(p.FAVORITE_MODE || null);
                setProfilePic(p.PROFILE_PIC_URL || null);
            }

            await loadStats();
            setLoading(false);
        };

        loadEverything();
    }, []);

    // ---------- LOAD STATS ----------
    const loadStats = async () => {
        const qGames = query(
            collection(db, "games"),
            where("uid", "==", uid),
            where("delete_mark", "==", "N")
        );

        const snap = await getDocs(qGames);

        let pts = 0;
        let wins = 0;

        snap.docs.forEach((g) => {
            const data = g.data();
            pts += data.score || 0;

            const resultName = master.getName(data.result)?.toLowerCase();
            if (resultName === "victoria") wins++;
        });

        setMatchesPlayed(snap.size);
        setVictories(wins);
        setTotalPoints(pts);
    };

    // ---------- IMAGE PICKER & UPLOAD ----------
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            uploadProfileImage(result.assets[0].uri);
        }
    };

    const uploadProfileImage = async (uri: string) => {
        try {
            const storage = getStorage();
            const imageRef = ref(storage, `users/${uid}/profile.jpg`);

            const response = await fetch(uri);
            const blob = await response.blob();
            await uploadBytes(imageRef, blob);

            const url = await getDownloadURL(imageRef);

            setProfilePic(url);

            await setDoc(
                doc(db, "game_profile", uid!),
                { PROFILE_PIC_URL: url },
                { merge: true }
            );

            Toast.show({ type: "success", text1: "Foto actualizada" });
        } catch (e) {
            Toast.show({ type: "error", text1: "Error al subir la imagen" });
        }
    };

    // ---------- SAVE PROFILE ----------
    const saveProfile = async () => {
        console.log("SAVE PROFILE CALLED");

        if (!username.trim()) {
            return Toast.show({
                type: "error",
                text1: "Nombre inválido",
                text2: "El nickname no puede estar vacío.",
            });
        }

        if (await isUsernameTaken(username.trim())) {
            return Toast.show({
                type: "error",
                text1: "Nombre no disponible",
                text2: "Ese nickname ya está en uso.",
            });
        }

        try {
            console.log("Updating USERS...");
            await setDoc(
                doc(db, "users", uid!),
                { USERNAME: username.trim() },
                { merge: true }
            );

            console.log("Updating GAME_PROFILE...");
            await setDoc(
                doc(db, "game_profile", uid!),
                {
                    USERNAME: username.trim(),
                    LANGUAGE: language,
                    BIO: bio,
                    MAIN_WEAPON: mainWeapon ?? null,
                    SECONDARY_WEAPON: secondaryWeapon ?? null,
                    FAVORITE_MODE: favoriteMode ?? null,
                },
                { merge: true }
            );

            Toast.show({ type: "success", text1: "Perfil actualizado" });
            setEditing(false);
        } catch (e) {
            console.log("SAVE ERROR:", e);
            Toast.show({
                type: "error",
                text1: "Error al guardar",
                text2: String(e),
            });
        }
    };

    // ---------- LOADING ----------
    if (loading) {
        return (
            <View style={globalStyles.PRF_loading}>
                <ActivityIndicator size="large" color="#FFA500" />
            </View>
        );
    }

    // ---------- UI ----------
    return (
        <KeyboardAwareScrollView
            style={globalStyles.PRF_container}
            enableOnAndroid
            extraScrollHeight={70}
        >

            {/* HEADER */}
            <View style={{ alignItems: "center", marginTop: 60 }}>
                <Image
                    source={profilePic ? { uri: profilePic } : defaultProfile}
                    style={globalStyles.PRF_profileImage}
                />

                {editing && (
                    <TouchableOpacity
                        style={globalStyles.PRF_changePicButton}
                        onPress={pickImage}
                    >
                        <Text style={globalStyles.PRF_changePicButtonText}>Cambiar foto</Text>
                    </TouchableOpacity>
                )}

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
                        <Text style={globalStyles.PRF_editButtonText}>Editar perfil</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* INFO CARD */}
            <View style={{ zIndex: 9999, position: "relative" }}>
                <View style={globalStyles.PRF_infoCard}>

                    {/* LANGUAGE */}
                    <Text style={globalStyles.PRF_infoLabel}>Idioma</Text>
                    {editing ? (
                        <View style={[globalStyles.PRF_dropdownWrapper, globalStyles.PRF_zLang]}>
                            <DropDownPicker
                                open={openLang}
                                value={language}
                                items={[
                                    { label: "Español", value: "es" },
                                    { label: "Inglés", value: "en" },
                                ]}
                                setOpen={(v) => {
                                    setOpenLang(v);
                                    setOpenPrimary(false);
                                    setOpenSecondary(false);
                                    setOpenMode(false);
                                }}
                                setValue={setLanguage}
                                style={globalStyles.PRF_dropdown}
                                dropDownContainerStyle={[
                                    globalStyles.PRF_dropdownContainer,
                                    { position: "absolute", top: 48, zIndex: 9999 }
                                ]}
                                placeholder="Selecciona un idioma"
                                listMode="SCROLLVIEW"
                                zIndex={4000}
                            />
                        </View>
                    ) : (
                        <Text style={globalStyles.PRF_infoValue}>
                            {language === "es" ? "Español" : "Inglés"}
                        </Text>
                    )}

                    {/* MAIN WEAPON */}
                    <Text style={globalStyles.PRF_infoLabel}>Arma principal</Text>
                    {editing ? (
                        <View style={[globalStyles.PRF_dropdownWrapper, globalStyles.PRF_zPrimary]}>
                            <DropDownPicker
                                open={openPrimary}
                                value={mainWeapon}
                                items={Object.entries(master.primaryGuns).map(([id, name]) => ({
                                    label: name,
                                    value: id,
                                }))}
                                setOpen={(v) => {
                                    setOpenPrimary(v);
                                    setOpenLang(false);
                                    setOpenSecondary(false);
                                    setOpenMode(false);
                                }}
                                setValue={setMainWeapon}
                                style={globalStyles.PRF_dropdown}
                                dropDownContainerStyle={[
                                    globalStyles.PRF_dropdownContainer,
                                    { position: "absolute", top: 48, zIndex: 9999 }
                                ]}
                                placeholder="Selecciona un arma"
                                listMode="SCROLLVIEW"
                                zIndex={3500}
                            />
                        </View>
                    ) : (
                        <Text style={globalStyles.PRF_infoValue}>
                            {master.getName(mainWeapon)}
                        </Text>
                    )}

                    {/* SECONDARY WEAPON */}
                    <Text style={globalStyles.PRF_infoLabel}>Arma secundaria</Text>
                    {editing ? (
                        <View style={[globalStyles.PRF_dropdownWrapper, globalStyles.PRF_zSecondary]}>
                            <DropDownPicker
                                open={openSecondary}
                                value={secondaryWeapon}
                                items={Object.entries(master.secondaryGuns).map(([id, name]) => ({
                                    label: name,
                                    value: id,
                                }))}
                                setOpen={(v) => {
                                    setOpenSecondary(v);
                                    setOpenLang(false);
                                    setOpenPrimary(false);
                                    setOpenMode(false);
                                }}
                                setValue={setSecondaryWeapon}
                                style={globalStyles.PRF_dropdown}
                                dropDownContainerStyle={[
                                    globalStyles.PRF_dropdownContainer,
                                    { position: "absolute", top: 48, zIndex: 9999 }
                                ]}
                                placeholder="Selecciona un arma"
                                listMode="SCROLLVIEW"
                                zIndex={3000}
                            />
                        </View>
                    ) : (
                        <Text style={globalStyles.PRF_infoValue}>
                            {master.getName(secondaryWeapon)}
                        </Text>
                    )}

                    {/* FAVORITE MODE */}
                    <Text style={globalStyles.PRF_infoLabel}>Modo de juego favorito</Text>
                    {editing ? (
                        <View style={[globalStyles.PRF_dropdownWrapper, globalStyles.PRF_zMode]}>
                            <DropDownPicker
                                open={openMode}
                                value={favoriteMode}
                                items={Object.entries(master.gameModes).map(([id, name]) => ({
                                    label: name,
                                    value: id,
                                }))}
                                setOpen={(v) => {
                                    setOpenMode(v);
                                    setOpenLang(false);
                                    setOpenPrimary(false);
                                    setOpenSecondary(false);
                                }}
                                setValue={setFavoriteMode}
                                style={globalStyles.PRF_dropdown}
                                dropDownContainerStyle={[
                                    globalStyles.PRF_dropdownContainer,
                                    { position: "absolute", top: 48, zIndex: 9999 }
                                ]}
                                placeholder="Selecciona un modo"
                                listMode="SCROLLVIEW"
                                zIndex={2500}
                            />
                        </View>
                    ) : (
                        <Text style={globalStyles.PRF_infoValue}>
                            {master.getName(favoriteMode)}
                        </Text>
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
                        <Text style={globalStyles.PRF_infoValue}>{bio || "—"}</Text>
                    )}

                </View>
            </View>

            {/* STATS */}
            {!editing && (
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
            )}

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
                        <Text style={globalStyles.PRF_cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}

        </KeyboardAwareScrollView>
    );
}
