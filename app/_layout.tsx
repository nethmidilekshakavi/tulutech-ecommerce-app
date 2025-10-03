import React from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const RootLayout = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Slot />
            </CartProvider>
        </AuthProvider>
    );
};

export default RootLayout;
