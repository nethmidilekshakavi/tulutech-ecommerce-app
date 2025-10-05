import React, { useContext, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from "react-native";
import { CartContext } from "@/context/CartContext";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CartCheckoutScreen = () => {
    // @ts-ignore
    const { cart, removeFromCart, updateQuantity, setCart } = useContext(CartContext);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((sum:any, item:any) => sum + item.price * item.quantity, 0);

    // Simple debug function
    const showDebug = (step:any, message:any) => {
        console.log(`🔵 ${step}: ${message}`);
        Alert.alert(`Step ${step}`, message);
    };

    const fetchPaymentSheetParams = async () => {
        try {
            showDebug("1", "Starting payment process...");

            const SERVER_URL = "http://192.168.65.236:3000/create-payment-intent";
            showDebug("2", `Connecting to: ${SERVER_URL}`);

            const response = await fetch(SERVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });

            showDebug("3", `Server status: ${response.status}`);

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            showDebug("4", "Payment intent created!");

            return data.clientSecret;

        } catch (error) {
            // @ts-ignore
            showDebug("ERROR", error.message);
            throw error;
        }
    };

    const logPaymentSuccess = async () => {
        try {
            const SERVER_URL = "http://192.168.65.236:3000/payment-success";

            await fetch(SERVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    paymentId: "PAY_" + Date.now(),
                    amount: total,
                    // @ts-ignore
                    items: cart.map(item => item.title),
                    timestamp: new Date().toLocaleTimeString()
                }),
            });

            console.log("✅ Payment logged to server!");
        } catch (error) {
            console.log("⚠️ Server log failed");
        }
    };

    const openPaymentSheet = async () => {
        if (!cart.length) {
            Alert.alert("Error", "Cart is empty");
            return;
        }

        setLoading(true);

        try {
            const SERVER_URL = "http://192.168.65.236:3000/create-payment-intent";
            const response = await fetch(SERVER_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });

            const data = await response.json();
            const clientSecret = data.clientSecret;

            // Initialize payment sheet
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: "My Shop",
                style: "automatic",
            });

            if (error) {
                Alert.alert("Error", error.message);
                return;
            }

            // Present payment sheet
            const { error: sheetError } = await presentPaymentSheet();

            if (sheetError) {
                Alert.alert("Payment Failed", sheetError.message);
            } else {
                // ✅ PAYMENT SUCCESSFUL - LOG HERE
                const paymentId = "PAY_" + Date.now();

                // 1. Show alert to user
                Alert.alert(
                    "Success! 🎉",
                    `Payment of $${total.toFixed(2)} completed!\nPayment ID: ${paymentId}`,
                    [
                        {
                            text: "OK",
                            onPress: () => {
                                // 2. Clear cart
                                setCart([]);

                                // 3. Send log to server
                                fetch("http://192.168.65.236:3000/payment-success", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        amount: total,
                                        paymentId: paymentId,
                                        items: cart,
                                        timestamp: new Date().toLocaleString()
                                    }),
                                }).then(() => {
                                    console.log("✅ Payment logged to server");
                                }).catch(() => {
                                    console.log("⚠️ Could not log to server");
                                });

                                // 4. Show in app console
                                console.log("🎉 PAYMENT SUCCESS!");
                                console.log("Amount: $" + total);
                                console.log("Items: " + cart.length);
                                console.log("Time: " + new Date().toLocaleTimeString());
                            }
                        }
                    ]
                );
            }

        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    // @ts-ignore
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
            <View style={styles.details}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>${item.price}</Text>
                <View style={styles.quantityContainer}>
                    <Text>Qty:</Text>
                    <TextInput
                        style={styles.quantityInput}
                        keyboardType="number-pad"
                        value={item.quantity.toString()}
                        onChangeText={(val) => updateQuantity(item.id, parseInt(val) || 1)}
                    />
                </View>
                <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromCart(item.id)}
                >
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (!cart.length) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={80} color="#CCCCCC" />
                <Text style={styles.emptyText}>Your cart is empty</Text>
                <TouchableOpacity style={styles.shoppingButton} onPress={() => router.back()}>
                    <Text style={styles.shoppingButtonText}>Go Shopping</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 10 }}
                style={{ flex: 1 }}
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>

                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#FF6B35" />
                                <Text style={styles.loadingText}>Processing payment...</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.checkoutBtn}
                                onPress={openPaymentSheet}
                            >
                                <Text style={styles.checkoutText}>
                                    Pay Now ${total.toFixed(2)}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </View>
    );
};

// Styles remain the same
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, overflow: "hidden", elevation: 3 },
    image: { width: 100, height: 100, resizeMode: "cover" },
    details: { flex: 1, padding: 10, justifyContent: "space-between" },
    title: { fontSize: 16, fontWeight: "600", color: "#333" },
    price: { fontSize: 14, fontWeight: "bold", color: "#FF6B35", marginVertical: 5 },
    quantityContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    quantityInput: { borderWidth: 1, borderColor: "#ccc", width: 50, height: 35, marginLeft: 5, padding: 5, borderRadius: 5, textAlign: "center" },
    removeBtn: { backgroundColor: "#FF6B35", paddingVertical: 8, borderRadius: 5, alignItems: "center", marginTop: 5 },
    removeText: { color: "#fff", fontWeight: "600" },
    footer: { paddingVertical: 20, alignItems: "center", backgroundColor: "#fff", marginTop: 10, borderRadius: 12, padding: 20 },
    totalText: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
    checkoutBtn: { backgroundColor: "#FF6B35", paddingHorizontal: 50, paddingVertical: 15, borderRadius: 25 },
    checkoutText: { color: "#fff", fontSize: 18, fontWeight: "600" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    emptyText: { fontSize: 18, color: "#999", marginBottom: 20, marginTop: 10 },
    shoppingButton: { backgroundColor: "#FF6B35", borderRadius: 10, paddingHorizontal: 30, paddingVertical: 14 },
    shoppingButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    loadingContainer: { alignItems: "center" },
    loadingText: { marginTop: 10, color: "#666" }
});

export default CartCheckoutScreen;