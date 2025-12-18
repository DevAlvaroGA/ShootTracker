import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";

// ----------------------
// Types & Interfaces
// ----------------------
export type FieldItem = {
    id: string;
    name: string;
};

// ----------------------
// Hook: useFields
// ----------------------
export function useFields() {
    const [fields, setFields] = useState<FieldItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState<string | null>(null);

    // Obtener UID real del usuario autenticado
    useEffect(() => {
        const unsub = getAuth().onAuthStateChanged((user) => {
            setUid(user?.uid ?? null);
        });
        return unsub;
    }, []);

    // Cargar campos estándar + personalizados
    useEffect(() => {
        if (!uid) return;

        setLoading(true);

        // Escuchar cambios en tiempo real
        const unsub = onSnapshot(collection(db, `users/${uid}/customFields`), async () => {
            const stdSnap = await getDocs(collection(db, "fields"));
            const stdFields = stdSnap.docs.map((d) => ({
                id: d.id,
                name: d.data().name,
            }));

            const customSnap = await getDocs(collection(db, `users/${uid}/customFields`));
            const customFields = customSnap.docs.map((d) => ({
                id: d.id,
                name: d.data().name,
            }));

            setFields([...stdFields, ...customFields]);
            setLoading(false);
        });

        return unsub;
    }, [uid]);

    // Crear nuevo campo
    const addField = async (name: string) => {
        if (!uid) return null;

        const ref = await addDoc(collection(db, `users/${uid}/customFields`), {
            name,
            createdAt: serverTimestamp(),
        });

        return { id: ref.id, name };
    };

    return { fields, loading, addField };
}
