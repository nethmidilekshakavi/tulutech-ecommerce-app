import React, { useContext } from "react";
import { View, Text, Button, FlatList, TextInput } from "react-native";
import { CartContext } from "@/context/CartContext";

const CartScreen = () => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

    const renderItem = ({ item }: any) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.title}</Text>
            <Text>Price: ${item.price}</Text>
            <TextInput
                keyboardType="number-pad"
                value={item.quantity.toString()}
                onChangeText={(val) => updateQuantity(item.id, parseInt(val) || 1)}
                style={{ borderWidth: 1, width: 50, padding: 5 }}
            />
            <Button title="Remove" onPress={() => removeFromCart(item.id)} />
        </View>
    );

    const total = cart.reduce((sum, item):any => sum + item.price * item.quantity, 0);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={cart}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            <Text style={{ fontSize: 18, padding: 10 }}>Total: ${total}</Text>
            <Button title="Checkout" onPress={() => alert("Go to Checkout")} />
        </View>
    );
};

export default CartScreen;
