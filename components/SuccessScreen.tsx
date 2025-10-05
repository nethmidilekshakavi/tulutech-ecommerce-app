// components/SuccessScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SuccessScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.message}>Thank you for your purchase</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/')}
            >
                <Text style={styles.buttonText}>Continue Shopping</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333'
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30
    },
    button: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});

export default SuccessScreen;