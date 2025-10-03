import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "@/context/AuthContext"
import { LoaderProvider } from "@/context/LoaderContext"
import { ThemeProvider } from "@/context/ThemeContext"
import {CartProvider} from "@/context/CartContext";


const RootLayout = () => {
    return (
        <LoaderProvider>
            <CartProvider>
            <AuthProvider>
                <ThemeProvider>
                        <Slot />
                </ThemeProvider>
            </AuthProvider>
                </CartProvider>
        </LoaderProvider>
    );
};

export default RootLayout;
