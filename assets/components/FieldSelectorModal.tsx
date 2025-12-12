import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from "react-native";
import { globalStyles } from "../components/globalStyles";

type Props = {
    visible: boolean;
    onClose: () => void;
    fields: { id: string; name: string }[];
    onSelect: (name: string) => void;
    onCreate: (name: string) => void;
};

export default function FieldSelectorModal({ visible, onClose, fields, onSelect, onCreate }: Props) {
    const [newField, setNewField] = useState("");

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={globalStyles.MODAL_overlay}>

                <View style={globalStyles.MODAL_card}>
                    <Text style={globalStyles.MODAL_title}>Seleccionar campo</Text>

                    {/* Lista scrollable */}
                    <ScrollView style={{ maxHeight: 250 }}>
                        {fields.map((f) => (
                            <TouchableOpacity
                                key={f.id}
                                style={globalStyles.MODAL_item}
                                onPress={() => {
                                    onSelect(f.name);
                                    onClose();
                                }}
                            >
                                <Text style={globalStyles.MODAL_itemText}>{f.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Crear nuevo campo */}
                    <Text style={globalStyles.MODAL_subtitle}>Añadir campo nuevo</Text>
                    <TextInput
                        placeholder="Nombre del campo"
                        placeholderTextColor="#888"
                        value={newField}
                        onChangeText={setNewField}
                        style={globalStyles.MODAL_input}
                    />

                    <TouchableOpacity
                        style={globalStyles.MODAL_button}
                        onPress={() => {
                            if (!newField.trim()) return;
                            onCreate(newField.trim());
                            setNewField("");
                            onClose();
                        }}
                    >
                        <Text style={globalStyles.MODAL_buttonText}>Guardar campo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose}>
                        <Text style={globalStyles.MODAL_closeText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
