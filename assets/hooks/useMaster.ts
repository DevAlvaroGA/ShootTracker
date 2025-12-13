// hooks/useMaster.ts
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
            // MASTER
            const snap = await getDocs(collection(db, "master"));
            const modes: MasterMap = {};
            const pg: MasterMap = {};
            const sg: MasterMap = {};
            const res: MasterMap = {};

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
                        res[d.id] = data.name;
                        break;
                }
            });

            setGameModes(modes);
            setPrimaryGuns(pg);
            setSecondaryGuns(sg);
            setResults(res);

            // FIELDS
            const fieldsSnap = await getDocs(collection(db, "fields"));
            const fld: MasterMap = {};

            fieldsSnap.forEach((d) => {
                const data = d.data();
                if (data.name) fld[d.id] = data.name;
            });

            setFields(fld);
        };

        load();
    }, []);

    const getName = (id?: string | null) =>
        id
            ? fields[id] ||
            gameModes[id] ||
            primaryGuns[id] ||
            secondaryGuns[id] ||
            results[id] ||
            "—"
            : "—";

    return {
        gameModes,
        primaryGuns,
        secondaryGuns,
        results,
        fields,
        getName,
    };
}
