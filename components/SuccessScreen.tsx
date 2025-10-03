import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const SuccessScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Payment Successful 🎉</Text>
            <Text style={styles.subtitle}>Thank you for your purchase!</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.replace("/(tabs)/Home")}>
                <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f8f8f8" },
    title: { fontSize: 24, fontWeight: "bold", color: "#FF6B35", marginBottom: 10 },
    subtitle: { fontSize: 16, color: "#333", marginBottom: 30 },
    button: { backgroundColor: "#FF6B35", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default SuccessScreen;
