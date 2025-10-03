// CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CartItem {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
}

type CartContextType = {
    items: CartItem[];
    addToCart: (product: Omit<CartItem, "quantity">, qty?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "@myapp_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        // load cart from storage
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) setItems(JSON.parse(raw));
            } catch (e) {
                console.warn("Failed to load cart:", e);
            }
        })();
    }, []);

    useEffect(() => {
        // persist on change
        (async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            } catch (e) {
                console.warn("Failed to save cart:", e);
            }
        })();
    }, [items]);

    const addToCart = (product: Omit<CartItem, "quantity">, qty = 1) => {
        setItems(prev => {
            const found = prev.find(p => p.id === product.id);
            if (found) {
                return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + qty } : p);
            }
            return [...prev, { ...product, quantity: qty }];
        });
    };

    const removeFromCart = (id: number) => {
        setItems(prev => prev.filter(p => p.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setItems(prev => prev.map(p => p.id === id ? { ...p, quantity } : p));
    };

    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};
