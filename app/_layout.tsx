import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Slot } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";

const RootLayout = () => {
    const [showLoading, setShowLoading] = useState<boolean>(true);

    console.log("🔴 RootLayout rendering, showLoading:", showLoading);

    useEffect(() => {
        console.log("🟡 RootLayout useEffect running");
        const timer = setTimeout(() => {
            console.log("🟢 Timer finished - hiding loading");
            setShowLoading(false);
        }, 3000);

        return () => {
            console.log("🔵 Cleanup");
            clearTimeout(timer);
        };
    }, []);

    // Show loading page first
    if (showLoading) {
        console.log("🎯 Showing Loading Screen");
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E40AF' }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Tulu Tech</Text>
                <Text style={{ color: 'white', fontSize: 16, marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    console.log("🚀 Showing main app");
    return (
        <AuthProvider>
            <LoaderProvider>
                <ThemeProvider>
                    <CartProvider>
                        <Slot />
                    </CartProvider>
                </ThemeProvider>
            </LoaderProvider>
        </AuthProvider>
    );
};

export default RootLayout;