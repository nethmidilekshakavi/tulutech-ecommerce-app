import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: any) => {
    const [cart, setCart] = useState<any[]>([]);

    // Load cart from AsyncStorage on app start
    useEffect(() => {
        AsyncStorage.getItem("cart").then((data) => {
            if (data) setCart(JSON.parse(data));
        });
    }, []);

    // Save cart whenever it changes
    useEffect(() => {
        AsyncStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
            setCart(cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCart(cart.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
