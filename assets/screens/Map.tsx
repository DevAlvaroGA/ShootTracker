// import React, { useState, useEffect } from "react";
// import { View, ActivityIndicator } from "react-native";
// // import { MapView, Marker } from "expo-maps";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "@/firebaseConfig";

// // Tipo de los campos de airsoft
// type AirsoftField = {
//     id: string;
//     name: string;
//     latitude: number;
//     longitude: number;
//     city: string;
// };

// export default function MapScreen() {
//     const [fields, setFields] = useState<AirsoftField[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const loadFields = async () => {
//             const snap = await getDocs(collection(db, "fields"));
//             const list = snap.docs.map(doc => ({
//                 id: doc.id,
//                 ...(doc.data() as Omit<AirsoftField, "id">),
//             }));

//             setFields(list);
//             setLoading(false);
//         };

//         loadFields();
//     }, []);

//     if (loading) {
//         return (
//             <View
//                 style={{
//                     flex: 1,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     backgroundColor: "#000",
//                 }}
//             >
//                 <ActivityIndicator size="large" color="#FFA500" />
//             </View>
//         );
//     }

//     return (
//         <MapView
//             style={{ flex: 1 }}
//             initialCameraPosition={{
//                 center: { latitude: 40.4168, longitude: -3.7038 }, // Madrid
//                 zoom: 5,
//             }}
//         >
//             {fields.map((field) => (
//                 <Marker
//                     key={field.id}
//                     coordinate={{
//                         latitude: field.latitude,
//                         longitude: field.longitude,
//                     }}
//                     title={field.name}
//                     description={field.city}
//                 />
//             ))}
//         </MapView>
//     );
// }
