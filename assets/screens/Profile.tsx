import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
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
} from "firebase/firestore";

export default function ProfileScreen() {
    const uid = auth.currentUser?.uid;
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);

    // USER INFO
    const [username, setUsername] = useState("");

    // GAME PROFILE
    const [language, setLanguage] = useState("es");
    const [bio, setBio] = useState("");
    const BIO_LIMIT = 200;

    const [mainWeapon, setMainWeapon] = useState(null);
    const [secondaryWeapon, setSecondaryWeapon] = useState(null);

    // STATS
    const [totalPoints, setTotalPoints] = useState(0);
    const [victories, setVictories] = useState(0);
    const [matchesPlayed, setMatchesPlayed] = useState(0);

    // WEAPONS LIST
    const [primaryWeapons, setPrimaryWeapons] = useState<any[]>([]);
    const [secondaryWeapons, setSecondaryWeapons] = useState<any[]>([]);

    // DEFAULT PROFILE IMAGE
    const defaultProfile = require("../images/default_profile.png");

    // ------------------------ LOAD DATA ------------------------
    useEffect(() => {
        const load = async () => {
            if (!uid) return;

            setLoading(true);

            // Load user (nickname)
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                setUsername(userDoc.data().USERNAME || "");
            }

            // Load game profile
            const profileDoc = await getDoc(doc(db, "game_profile", uid));
            if (profileDoc.exists()) {
                const p = profileDoc.data();
                setLanguage(p.LANGUAGE || "es");
                setBio(p.BIO || "");
                setMainWeapon(p.MAIN_WEAPON || null);
                setSecondaryWeapon(p.SECONDARY_WEAPON || null);
            }

            await loadWeapons();

            // Load game stats
            const qGames = query(
                collection(db, "games"),
                where("delete_mark", "==", "N"),
                where("uid", "==", uid)
            );

            const gSnap = await getDocs(qGames);

            let pts = 0;
            let wins = 0;

            gSnap.forEach((g) => {
                pts += g.data().score || 0;
                if (g.data().result === "Victoria") wins++;
            });

            setMatchesPlayed(gSnap.size);
            setVictories(wins);
            setTotalPoints(pts);

            setLoading(false);
        };

        load();
    }, []);

    // ------------------------ LOAD WEAPONS ------------------------
    const loadWeapons = async () => {
        const q1 = query(
            collection(db, "master"),
            where("master_type", "==", "guns"),
            where("value1", "==", "primaryGun")
        );

        const q2 = query(
            collection(db, "master"),
            where("master_type", "==", "guns"),
            where("value1", "==", "secondaryGun")
        );

        const snap1 = await getDocs(q1);
        const snap2 = await getDocs(q2);

        setPrimaryWeapons(
            snap1.docs.map((d) => ({
                label: d.data().name,
                value: d.data().id || d.data().name,
            }))
        );

        setSecondaryWeapons(
            snap2.docs.map((d) => ({
                label: d.data().name,
                value: d.data().id || d.data().name,
            }))
        );
    };

    // ------------------------ SAVE PROFILE ------------------------
    const saveProfile = async () => {
        if (bio.length > BIO_LIMIT) {
            Toast.show({ type: "error", text1: "Bio demasiado larga" });
            return;
        }

        if (!username.trim()) {
            Toast.show({ type: "error", text1: "Nickname inválido" });
            return;
        }

        await updateDoc(doc(db, "game_profile", uid!), {
            LANGUAGE: language,
            BIO: bio,
            MAIN_WEAPON: mainWeapon,
            SECONDARY_WEAPON: secondaryWeapon,
            DELETE_MARK: "N",
        });

        await updateDoc(doc(db, "users", uid!), {
            USERNAME: username.trim(),
        });

        Toast.show({ type: "success", text1: "Perfil actualizado" });

        setEditing(false);
    };

    const cancelEdit = () => setEditing(false);

    if (loading) {
        return (
            <View style={globalStyles.PRF_loading}>
                <ActivityIndicator size="large" color="#FFA500" />
            </View>
        );
    }

    return (
        <ScrollView style={globalStyles.PRF_container}>

            {/* ---------- PROFILE IMAGE + NAME ---------- */}
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

            {/* ---------- EDITABLE INFO ---------- */}
            <View style={globalStyles.PRF_infoCard}>

                {/* Language */}
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

                {/* Bio */}
                <Text style={globalStyles.PRF_infoLabel}>Biografía ({bio.length}/{BIO_LIMIT})</Text>
                {editing ? (
                    <TextInput
                        value={bio}
                        multiline
                        onChangeText={(t) => {
                            if (t.length <= BIO_LIMIT) setBio(t);
                            else {
                                Toast.show({
                                    type: "error",
                                    text1: "Límite alcanzado",
                                    text2: `Máximo ${BIO_LIMIT} caracteres.`,
                                });
                            }
                        }}
                        style={globalStyles.PRF_bioInput}
                    />
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>{bio}</Text>
                )}

                {/* Main weapon */}
                <Text style={globalStyles.PRF_infoLabel}>Arma principal</Text>
                {editing ? (
                    <View style={globalStyles.PRF_pickerWrapper}>
                        <Picker
                            selectedValue={mainWeapon}
                            dropdownIconColor="#FFA500"
                            style={globalStyles.PRF_picker}
                            onValueChange={(v) => setMainWeapon(v)}
                        >
                            {primaryWeapons.map((w) => (
                                <Picker.Item key={w.value} label={w.label} value={w.value} />
                            ))}
                        </Picker>
                    </View>
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>{mainWeapon || "No asignada"}</Text>
                )}

                {/* Secondary weapon */}
                <Text style={globalStyles.PRF_infoLabel}>Arma secundaria</Text>
                {editing ? (
                    <View style={globalStyles.PRF_pickerWrapper}>
                        <Picker
                            selectedValue={secondaryWeapon}
                            dropdownIconColor="#FFA500"
                            style={globalStyles.PRF_picker}
                            onValueChange={(v) => setSecondaryWeapon(v)}
                        >
                            {secondaryWeapons.map((w) => (
                                <Picker.Item key={w.value} label={w.label} value={w.value} />
                            ))}
                        </Picker>
                    </View>
                ) : (
                    <Text style={globalStyles.PRF_infoValue}>{secondaryWeapon || "No asignada"}</Text>
                )}

            </View>

            {/* ---------- STATS ---------- */}
            <View style={globalStyles.PRF_statsCard}>
                <Text style={globalStyles.PRF_statsText}>Partidas jugadas: {matchesPlayed}</Text>
                <Text style={globalStyles.PRF_statsText}>Victorias: {victories}</Text>
                <Text style={globalStyles.PRF_statsText}>Puntos totales: {totalPoints}</Text>
            </View>

            {/* ---------- SAVE / CANCEL ---------- */}
            {editing && (
                <View style={globalStyles.PRF_buttonsRow}>
                    <TouchableOpacity style={globalStyles.PRF_saveButton} onPress={saveProfile}>
                        <Text style={globalStyles.PRF_saveButtonText}>Guardar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={globalStyles.PRF_cancelButton} onPress={cancelEdit}>
                        <Text style={globalStyles.PRF_cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            )}

        </ScrollView>
    );
}
