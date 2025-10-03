// screens/SuccessScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SuccessScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>🎉 Payment Successful!</Text>
            <Button title="Back to Home" onPress={() => navigation.navigate("Home")} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default SuccessScreen;
