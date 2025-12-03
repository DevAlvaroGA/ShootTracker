import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Pantalla de Mapa (Temporal)</Text>
            <Text style={styles.subtext}>Aquí irá el mapa interactivo.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#FFA500",
        fontSize: 22,
        fontWeight: "bold",
    },
    subtext: {
        color: "#ccc",
        marginTop: 10,
    },
});
