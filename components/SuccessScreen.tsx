import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SuccessScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        // Server log when success screen loads
        console.log("🎉 Success Screen Loaded - Payment Completed!");
        console.log("✅ Navigation working perfectly!");
    }, []);

    return (
        <View style={styles.container}>
            <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.message}>Thank you for your purchase</Text>
            <Text style={styles.subMessage}>Your order has been confirmed</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/')}
            >
                <Text style={styles.buttonText}>Continue Shopping</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => router.back()}
            >
                <Text style={styles.secondaryButtonText}>View Order Details</Text>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
        textAlign: 'center'
    },
    message: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10
    },
    subMessage: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginBottom: 30
    },
    button: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 15,
        width: '80%',
        alignItems: 'center'
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#FF6B35'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    },
    secondaryButtonText: {
        color: '#FF6B35',
        fontSize: 16,
        fontWeight: '600'
    }
});

export default SuccessScreen;