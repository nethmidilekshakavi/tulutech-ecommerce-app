import React, { useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from "react-native";
import { CartContext } from "@/context/CartContext";

const CartScreen = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

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

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Your cart is empty 🛒</Text>
                </View>
            ) : (
                <FlatList
                    data={cart}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ padding: 10 }}
                    ListFooterComponent={
                        <View style={styles.footer}>
                            <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                            <TouchableOpacity style={styles.checkoutBtn} onPress={() => alert("Go to Checkout")}>
                                <Text style={styles.checkoutText}>Checkout</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 3,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
    },
    details: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    title: { fontSize: 16, fontWeight: '600', color: '#333' },
    price: { fontSize: 14, fontWeight: 'bold', color: '#FF6B35', marginVertical: 5 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    quantityInput: { borderWidth: 1, borderColor: '#ccc', width: 50, height: 35, marginLeft: 5, padding: 5, borderRadius: 5 },
    removeBtn: { backgroundColor: '#FF6B35', paddingVertical: 5, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    removeText: { color: '#fff', fontWeight: '600' },
    footer: { paddingVertical: 20, alignItems: 'center' },
    totalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    checkoutBtn: { backgroundColor: '#FF6B35', paddingHorizontal: 50, paddingVertical: 12, borderRadius: 25 },
    checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#999' },
});

export default CartScreen;
