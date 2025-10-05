import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function TabLayout() {
    // @ts-ignore
    // @ts-ignore
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF6B35',
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Product"
                options={{
                    title: 'Products',
                    tabBarIcon: ({ color, size }) => (
                        // @ts-ignore
                        <AntDesign name="appstore1" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="CartScreen"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, size }) => (
                        // @ts-ignore
                        <AntDesign name="shoppingcart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
