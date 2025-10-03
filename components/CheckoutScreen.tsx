import React, { useContext, useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { CartContext } from "@/context/CartContext";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CartCheckoutScreen = () => {
    const { cart, removeFromCart, updateQuantity, setCart } = useContext(CartContext);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const fetchPaymentSheetParams = async () => {
        const res = await fetch("http://192.168.65.236:3000/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total }),
        });
        const data = await res.json();
        if (!res.ok || !data.clientSecret) throw new Error(data.error || "Failed to create payment intent");
        return data.clientSecret;
    };

    const openPaymentSheet = async () => {
        if (!cart.length || total <= 0) {
            Alert.alert("Error", "Cart is empty or total is invalid");
            return;
        }

        setLoading(true);
        try {
            const clientSecret = await fetchPaymentSheetParams();
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: "My Shop",
                style: "automatic",
                returnURL: "myapp://checkout",
            });

            if (error) {
                Alert.alert("Setup Error", error.message);
                setLoading(false);
                return;
            }

            const { error: sheetError } = await presentPaymentSheet();

            if (sheetError) {
                Alert.alert(
                    sheetError.code === "Canceled" ? "Payment Cancelled" : "Payment Failed",
                    sheetError.message
                );
            } else {
                Alert.alert("Success", "Payment completed successfully!", [
                    { text: "OK", onPress: () => { setCart([]); router.replace("/success"); } }
                ]);
            }
        } catch (err: any) {
            Alert.alert("Error", err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: any) => (
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
                <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.id)}>
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
        <ScrollView style={styles.container}>
            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 10 }}
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#FF6B35" />
                        ) : (
                            <TouchableOpacity style={styles.checkoutBtn} onPress={openPaymentSheet}>
                                <Text style={styles.checkoutText}>Pay Now ${total.toFixed(2)}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8f8" },
    card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 12, marginBottom: 15, overflow: "hidden", elevation: 3 },
    image: { width: 100, height: 100, resizeMode: "cover" },
    details: { flex: 1, padding: 10, justifyContent: "space-between" },
    title: { fontSize: 16, fontWeight: "600", color: "#333" },
    price: { fontSize: 14, fontWeight: "bold", color: "#FF6B35", marginVertical: 5 },
    quantityContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    quantityInput: { borderWidth: 1, borderColor: "#ccc", width: 50, height: 35, marginLeft: 5, padding: 5, borderRadius: 5 },
    removeBtn: { backgroundColor: "#FF6B35", paddingVertical: 5, borderRadius: 5, alignItems: "center", marginTop: 5 },
    removeText: { color: "#fff", fontWeight: "600" },
    footer: { paddingVertical: 20, alignItems: "center" },
    totalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    checkoutBtn: { backgroundColor: "#FF6B35", paddingHorizontal: 50, paddingVertical: 12, borderRadius: 25 },
    checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    emptyText: { fontSize: 18, color: "#999", marginBottom: 20 },
    shoppingButton: { backgroundColor: "#FF6B35", borderRadius: 10, paddingHorizontal: 30, paddingVertical: 14 },
    shoppingButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default CartCheckoutScreen;
