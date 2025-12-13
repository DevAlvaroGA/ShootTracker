/**
 * MIGRATION SCRIPT – SAFE VERSION
 * Corrige:
 * 1. fieldName texto  → ID de /fields
 * 2. weapon1 y weapon2 texto → ID de /master (primary / secondary)
 * 3. gameMode texto → ID correcto
 * 4. result texto → ID correcto
 */

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrate() {
    console.log("=== MIGRACIÓN COMPLETA INICIADA ===");

    // --------------------------------------------------
    // 1. Cargar master: campos, armas, modos, resultados
    // --------------------------------------------------

    const fieldsSnap = await db.collection("fields").get();
    const masterSnap = await db.collection("master").get();

    const fieldsByName = {};  // name -> id
    fieldsSnap.forEach(doc => {
        const data = doc.data();
        if (data.name) {
            fieldsByName[data.name.trim().toLowerCase()] = doc.id;
        }
    });

    const gameModesByName = {};
    const primaryByName = {};
    const secondaryByName = {};
    const resultsByName = {};

    masterSnap.forEach(doc => {
        const data = doc.data();
        if (!data.master_type || !data.name) return;

        const nameKey = data.name.trim().toLowerCase();

        switch (data.master_type) {
            case "game_mode":
                gameModesByName[nameKey] = doc.id;
                break;

            case "guns":
                if (data.value1 === "primaryGun")
                    primaryByName[nameKey] = doc.id;
                if (data.value1 === "secondaryGun")
                    secondaryByName[nameKey] = doc.id;
                break;

            case "results":
                resultsByName[nameKey] = doc.id;
                break;
        }
    });

    console.log("Master cargado correctamente.");
    console.log({
        campos: Object.keys(fieldsByName).length,
        modos: Object.keys(gameModesByName).length,
        armasPrim: Object.keys(primaryByName).length,
        armasSec: Object.keys(secondaryByName).length,
        resultados: Object.keys(resultsByName).length
    });

    // --------------------------------------------------
    // 2. Cargar partidas
    // --------------------------------------------------

    const gamesSnap = await db.collection("games").get();
    let updated = 0;
    let unchanged = 0;

    console.log(`Encontradas ${gamesSnap.size} partidas.`);

    // --------------------------------------------------
    // 3. Migración partida por partida (segura)
    // --------------------------------------------------

    for (const docGame of gamesSnap.docs) {
        const g = docGame.data();
        const updates = {};

        // ---------- CAMPO ----------
        if (typeof g.fieldName === "string") {
            const key = g.fieldName.trim().toLowerCase();
            const match = fieldsByName[key];

            if (match) {
                updates.fieldName = match;
                console.log(`✔ Campo migrado (${g.fieldName} → ${match}) en partida ${docGame.id}`);
            } else {
                console.log(`⚠ Campo NO encontrado "${g.fieldName}" en partida ${docGame.id}`);
            }
        }

        // ---------- MODO ----------
        if (typeof g.gameMode === "string" && g.gameMode.length > 4) {
            // probablemente ya sea ID
        } else if (typeof g.gameMode === "string") {
            const key = g.gameMode.trim().toLowerCase();
            const match = gameModesByName[key];

            if (match) {
                updates.gameMode = match;
                console.log(`✔ Modo migrado (${g.gameMode} → ${match}) en partida ${docGame.id}`);
            } else {
                console.log(`⚠ Modo NO encontrado "${g.gameMode}" en partida ${docGame.id}`);
            }
        }

        // ---------- ARMA 1 ----------
        if (typeof g.weapon1 === "string" && g.weapon1.length <= 4) {
            // es nombre → migrar
            const key = g.weapon1.trim().toLowerCase();
            const match =
                primaryByName[key] || secondaryByName[key];

            if (match) {
                updates.weapon1 = match;
                console.log(`✔ Arma 1 migrada (${g.weapon1} → ${match}) en partida ${docGame.id}`);
            } else {
                console.log(`⚠ Arma 1 NO encontrada "${g.weapon1}" en partida ${docGame.id}`);
            }
        }

        // ---------- ARMA 2 ----------
        if (typeof g.weapon2 === "string" && g.weapon2.length <= 4) {
            const key = g.weapon2.trim().toLowerCase();
            const match =
                primaryByName[key] || secondaryByName[key];

            if (match) {
                updates.weapon2 = match;
                console.log(`✔ Arma 2 migrada (${g.weapon2} → ${match}) en partida ${docGame.id}`);
            } else {
                console.log(`⚠ Arma 2 NO encontrada "${g.weapon2}" en partida ${docGame.id}`);
            }
        }

        // ---------- RESULTADO ----------
        if (typeof g.result === "string" && g.result.length <= 4) {
            const key = g.result.trim().toLowerCase();
            const match = resultsByName[key];

            if (match) {
                updates.result = match;
                console.log(`✔ Resultado migrado (${g.result} → ${match}) en partida ${docGame.id}`);
            } else {
                console.log(`⚠ Resultado NO encontrado "${g.result}" en partida ${docGame.id}`);
            }
        }

        // ---------- APLICAR ACTUALIZACIÓN ----------
        if (Object.keys(updates).length > 0) {
            await docGame.ref.update(updates);
            updated++;
        } else {
            unchanged++;
        }
    }

    console.log("=== MIGRACIÓN COMPLETADA ===");
    console.log(`Partidas actualizadas: ${updated}`);
    console.log(`Partidas sin cambios: ${unchanged}`);
}

migrate().catch(console.error);
