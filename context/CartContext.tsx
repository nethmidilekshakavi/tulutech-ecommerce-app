import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Product = {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity?: number;
};

type CartContextType = {
    cart: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    setCart: (products: Product[]) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

type Props = { children: ReactNode };

export const CartProvider = ({ children }: Props) => {
    const [cart, setCart] = useState<Product[]>([]);

    // Load cart from AsyncStorage on app start
    useEffect(() => {
        const loadCart = async () => {
            try {
                const data = await AsyncStorage.getItem("cart");
                if (data) setCart(JSON.parse(data));
            } catch (error) {
                console.log("Error loading cart:", error);
            }
        };
        loadCart();
    }, []);

    // Save cart to AsyncStorage whenever it changes
    useEffect(() => {
        const saveCart = async () => {
            try {
                await AsyncStorage.setItem("cart", JSON.stringify(cart));
            } catch (error) {
                console.log("Error saving cart:", error);
            }
        };
        saveCart();
    }, [cart]);

    const addToCart = (product: Product) => {
        const existing = cart.find((item) => item.id === product.id);
        if (existing) {
            setCart(
                cart.map((item) =>
                    item.id === product.id ? { ...item, quantity: (item.quantity || 0) + 1 } : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (id: number) => setCart(cart.filter((item) => item.id !== id));

    const updateQuantity = (id: number, quantity: number) =>
        setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, setCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
