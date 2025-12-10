/**
 * SEED PARA AÑADIR CAMPOS DE AIRSOFT A FIRESTORE
 * Ejecutar una sola vez:
 * 
 *   node seedFields.js
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// ----------- 1. CARGAR SERVICE ACCOUNT -----------
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();

// ----------- 2. CAMPOS DE AIRSOFT A INSERTAR -----------
const fields = [
    {
        name: "Campo de Airsoft La Granja",
        latitude: 40.5272,
        longitude: -3.6903,
        city: "Madrid",
    },
    {
        name: "Airsoft Total",
        latitude: 41.3870,
        longitude: 2.1701,
        city: "Barcelona",
    },
    {
        name: "Forte Royal Airsoft",
        latitude: 37.1765,
        longitude: -3.5995,
        city: "Granada",
    },
    {
        name: "CQB Las Eras",
        latitude: 40.0004,
        longitude: -4.0032,
        city: "Toledo",
    },
    {
        name: "Airsoft Los Valles",
        latitude: 42.1401,
        longitude: -0.4089,
        city: "Huesca",
    },
    {
        name: "La Guía Cartagena",
        latitude: 37.6325,
        longitude: -0.9699,
        city: "Murcia",
    },
    {
        name: "Airsoft Zone Sur",
        latitude: 36.7213,
        longitude: -4.4214,
        city: "Málaga",
    },
    {
        name: "Campo Survival León",
        latitude: 42.5987,
        longitude: -5.5671,
        city: "León",
    },
    {
        name: "Pandora Airsoft",
        latitude: 39.4699,
        longitude: -0.3763,
        city: "Valencia",
    },
    {
        name: "Zona 77 Airsoft",
        latitude: 41.6488,
        longitude: -0.8891,
        city: "Zaragoza",
    },
];

// ----------- 3. INSERTAR EN FIRESTORE -----------
async function seed() {
    console.log("Iniciando carga de campos...");

    for (const field of fields) {
        const docRef = db.collection("fields").doc(); // crea ID automático
        await docRef.set({
            ...field,
            active: true,
            createdAt: new Date(),
        });
        console.log(`✔ Campo añadido: ${field.name}`);
    }

    console.log("----- PROCESO COMPLETADO -----");
}

seed().catch((err) => {
    console.error("Error al ejecutar el seed:", err);
});
