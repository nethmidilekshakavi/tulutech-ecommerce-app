// screens/CartScreen.tsx
import React, { useContext } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Animated,
    Alert
} from "react-native";
// @ts-ignore
import { CartContext, CartItem } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";

const CartScreen = () => {
    // @ts-ignore
    const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

    const renderItem = ({ item }: { item: CartItem }) => (
        <Animated.View
            style={[
                styles.card,
                {
                    opacity: 1,
                    transform: [{ translateY: 0 }]
                }
            ]}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.thumbnail }} style={styles.image} />
                <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{item.discountPercentage}%</Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => removeFromCart(item.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.brand}>{item.brand}</Text>
                <Text style={styles.price}>${item.price}</Text>

                <View style={styles.quantitySection}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={styles.quantityBtn}
                            onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                            <Ionicons name="remove" size={16} color="#FFF" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.quantityInput}
                            keyboardType="number-pad"
                            value={item.quantity.toString()}
                            onChangeText={(val) => updateQuantity(item.id, parseInt(val) || 1)}
                        />

                        <TouchableOpacity
                            style={styles.quantityBtn}
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Ionicons name="add" size={16} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.itemTotal}>
                    <Text style={styles.itemTotalText}>
                        Item Total: <Text style={styles.itemTotalPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                    </Text>
                </View>
            </View>
        </Animated.View>
    );

    const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);
    const shipping = total > 50 ? 0 : 9.99;
    const finalTotal = total + shipping;

    const handleCheckout = () => {
        Alert.alert(
            "Checkout",
            `Proceed to pay $${finalTotal.toFixed(2)}?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Confirm", onPress: () => {
                        Alert.alert("Success", "Order placed successfully! 🎉");
                        clearCart();
                    }}
            ]
        );
    };

    const handleClearCart = () => {
        if (cart.length === 0) {
            Alert.alert("Cart Empty", "Your cart is already empty!");
            return;
        }

        Alert.alert(
            "Clear Cart",
            "Are you sure you want to remove all items from your cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Clear All",
                    onPress: () => clearCart(),
                    style: "destructive"
                }
            ]
        );
    };

    const handleShopNow = () => {
        // Navigate to your products screen
        // navigation.navigate('Products');
        Alert.alert("Shop Now", "Navigate to products screen");
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Shopping Cart</Text>
                <Text style={styles.itemCount}>({cart.length} {cart.length === 1 ? 'item' : 'items'})</Text>
            </View>

            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#DDD" />
                    <Text style={styles.emptyTitle}>Your cart is empty</Text>
                    <Text style={styles.emptySubtitle}>Add some items to get started</Text>
                    <TouchableOpacity style={styles.shopNowBtn} onPress={handleShopNow}>
                        <Text style={styles.shopNowText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={cart}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={
                        <View style={styles.footer}>
                            {/* Summary Card */}
                            <View style={styles.summaryCard}>
                                <Text style={styles.summaryTitle}>Order Summary</Text>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Subtotal</Text>
                                    <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
                                </View>

                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Shipping</Text>
                                    <Text style={styles.summaryValue}>
                                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                                    </Text>
                                </View>

                                {shipping > 0 && (
                                    <Text style={styles.freeShippingNote}>
                                        Add ${(50 - total).toFixed(2)} more for free shipping!
                                    </Text>
                                )}

                                <View style={styles.divider} />

                                <View style={styles.summaryRow}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <TouchableOpacity
                                style={styles.checkoutBtn}
                                onPress={handleCheckout}
                            >
                                <Ionicons name="card" size={20} color="#FFF" />
                                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.clearCartBtn}
                                onPress={handleClearCart}
                            >
                                <Text style={styles.clearCartText}>Clear Cart</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        backgroundColor: '#FFF',
        padding: 20,
        paddingTop: 60,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1E293B',
        textAlign: 'center',
    },
    itemCount: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 5,
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        flexDirection: 'row',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    imageContainer: {
        position: 'relative',
        marginRight: 16,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 12,
        resizeMode: 'cover',
    },
    discountBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    discountText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        flex: 1,
        marginRight: 8,
    },
    deleteBtn: {
        padding: 4,
    },
    brand: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 4,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B35',
        marginBottom: 8,
    },
    quantitySection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    quantityLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityBtn: {
        backgroundColor: '#FF6B35',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        width: 40,
        height: 32,
        marginHorizontal: 8,
        textAlign: 'center',
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
        fontWeight: '600',
    },
    itemTotal: {
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 8,
    },
    itemTotalText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    itemTotalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    footer: {
        paddingBottom: 30,
    },
    summaryCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    freeShippingNote: {
        fontSize: 12,
        color: '#FF6B35',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF6B35',
    },
    checkoutBtn: {
        backgroundColor: '#FF6B35',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
    },
    checkoutText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    clearCartBtn: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    clearCartText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#64748B',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        marginBottom: 24,
    },
    shopNowBtn: {
        backgroundColor: '#FF6B35',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 25,
    },
    shopNowText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CartScreen;