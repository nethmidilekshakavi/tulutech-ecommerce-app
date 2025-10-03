import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons,MaterialCommunityIcons  } from '@expo/vector-icons';


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF6B35',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                    elevation: 5,
                    height: 60,
                    paddingBottom: 6,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Product"
                options={{
                    title: 'Products',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="shopping-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Cart"
                options={{
                    title: 'Cart',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Profile"
                options={{
                    title: 'Account',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
