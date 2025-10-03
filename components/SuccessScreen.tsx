import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const SuccessScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.icon}>✅</Text>
                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.message}>
                    Thank you for your purchase. Your order has been confirmed.
                </Text>
                <Text style={styles.subMessage}>
                    You will receive a confirmation email shortly.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace("/")}
                >
                    <Text style={styles.buttonText}>Continue Shopping</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        padding: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 40,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: "100%",
        maxWidth: 400,
    },
    icon: {
        fontSize: 80,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 10,
        lineHeight: 24,
    },
    subMessage: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#FF6B35",
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        width: "100%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});

export default SuccessScreen;