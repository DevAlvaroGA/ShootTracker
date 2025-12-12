import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";

type MasterMap = Record<string, string>;

export function useMaster() {
    const [gameModes, setGameModes] = useState<MasterMap>({});
    const [primaryGuns, setPrimaryGuns] = useState<MasterMap>({});
    const [secondaryGuns, setSecondaryGuns] = useState<MasterMap>({});
    const [results, setResults] = useState<MasterMap>({});
    const [fields, setFields] = useState<MasterMap>({});

    useEffect(() => {
        const load = async () => {
            const snap = await getDocs(collection(db, "master"));
            const modes: MasterMap = {};
            const pg: MasterMap = {};
            const sg: MasterMap = {};
            const res: MasterMap = {};
            const fld: MasterMap = {};

            snap.forEach((d) => {
                const data = d.data();
                if (!data.master_type || !data.name) return;

                switch (data.master_type) {
                    case "game_mode":
                        modes[d.id] = data.name;
                        break;

                    case "guns":
                        if (data.value1 === "primaryGun") pg[d.id] = data.name;
                        if (data.value1 === "secondaryGun") sg[d.id] = data.name;
                        break;

                    case "results":
                        res[d.id] = data.name;   // Victoria/Empate/Derrota
                        break;

                    case "fields":
                        fld[d.id] = data.name;
                        break;
                }
            });

            setGameModes(modes);
            setPrimaryGuns(pg);
            setSecondaryGuns(sg);
            setResults(res);
            setFields(fld);
        };

        load();
    }, []);

    // Convertir mapas en listas DropDownPicker
    const mapToList = (m: MasterMap) =>
        Object.entries(m).map(([id, name]) => ({
            label: name,
            value: id,
        }));

    return {
        gameModes,
        primaryGuns,
        secondaryGuns,
        results,
        fields,

        gameModesList: mapToList(gameModes),
        primaryGunsList: mapToList(primaryGuns),
        secondaryGunsList: mapToList(secondaryGuns),
        resultsList: mapToList(results),

        getName: (id?: string | null) => {
            if (!id) return "—";
            return (
                gameModes[id] ||
                primaryGuns[id] ||
                secondaryGuns[id] ||
                results[id] ||
                fields[id] ||
                "—"
            );
        },
    };
}
