import React, { useContext, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { CartContext } from "@/context/CartContext";

const CheckoutScreen = () => {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { cart, setCart } = useContext(CartContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Calculate total from cart
    const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const fetchPaymentSheetParams = async () => {
        try {
            const res = await fetch("http://192.168.65.236:3000/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }), // Use cart total
            });

            if (!res.ok) {
                throw new Error("Failed to create payment intent");
            }

            const { clientSecret } = await res.json();
            return clientSecret;
        } catch (error) {
            throw error;
        }
    };

    const openPaymentSheet = async () => {
        setLoading(true);

        try {
            const clientSecret = await fetchPaymentSheetParams();

            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: "My Shop",
                style: "automatic",
            });

            if (error) {
                Alert.alert("Error", error.message);
                setLoading(false);
                return;
            }

            const { error: sheetError } = await presentPaymentSheet();

            if (sheetError) {
                // Payment failed or was cancelled
                Alert.alert(
                    "Payment Failed",
                    sheetError.message,
                    [{ text: "OK" }]
                );
            } else {
                // Payment successful
                Alert.alert(
                    "Success",
                    "Payment completed successfully!",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // Clear cart and navigate to success page
                                setCart([]);
                                router.replace("/success");
                            }
                        }
                    ]
                );
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <Button title="Go Shopping" onPress={() => router.back()} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>

            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                {cart.map((item: any) => (
                    <View key={item.id} style={styles.itemRow}>
                        <Text style={styles.itemText}>{item.title} x {item.quantity}</Text>
                        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#FF6B35" style={{ marginTop: 20 }} />
            ) : (
                <View style={styles.buttonContainer}>
                    <Button title="Pay Now" onPress={openPaymentSheet} color="#FF6B35" />
                    <View style={{ marginTop: 10 }}>
                        <Button title="Back to Cart" onPress={() => router.back()} color="#666" />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    summaryContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        elevation: 3,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
    },
    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
        color: "#333",
        flex: 1,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FF6B35",
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 15,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    totalText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FF6B35",
    },
    buttonContainer: {
        marginTop: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: "#999",
        marginBottom: 20,
    },
});

export default CheckoutScreen;