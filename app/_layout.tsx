import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";

const RootLayout = () => {
    const [showLoading, setShowLoading] = useState<boolean>(true);

    console.log("RootLayout rendering, showLoading:", showLoading);

    useEffect(() => {
        console.log("🟡 RootLayout useEffect running");
        const timer = setTimeout(() => {
            console.log("🟢 Timer finished - hiding loading");
            setShowLoading(false);
        }, 3000);

        return () => {
            console.log("Cleanup");
            clearTimeout(timer);
        };
    }, []);

    // Show loading page first
    if (showLoading) {
        console.log("Showing Loading Screen");
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    {/* Tulu Tech Logo */}
                    <Image
                        source={require('@/assets/images/Black-tulutech-1.png')}
                        style={styles.logo}
                        resizeMode="contain"
                        onLoad={() => console.log("✅ Logo image loaded successfully")}
                        onError={(e) => console.log("❌ Logo image error:", e.nativeEvent.error)}
                    />

                    <Text style={styles.title}>Tulu Tech</Text>
                    <Text style={styles.subtitle}>Loading...</Text>

                    {/* Loading Dots Animation */}
                    <View style={styles.loadingDots}>
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    title: {
        color: 'white',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        letterSpacing: 1,
    },
    subtitle: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
        opacity: 0.8,
    },
    loadingDots: {
        flexDirection: 'row',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        marginHorizontal: 4,
        opacity: 0.6,
    },
});

export default RootLayout;