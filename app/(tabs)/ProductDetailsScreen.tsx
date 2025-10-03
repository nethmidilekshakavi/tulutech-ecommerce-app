import React, { useContext } from "react";
import { View, Text, Image, Button, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CartContext } from "@/context/CartContext";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    thumbnail: string;
}

const ProductDetailsScreen = () => {
    // @ts-ignore
    const { addToCart } = useContext(CartContext);
    const router = useRouter();
    const params = useLocalSearchParams();

    // Get product data passed via params
    const product = params as unknown as Product;

    const handleAddToCart = () => {
        addToCart(product);
        alert("Product added to cart!");
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            <Image
                source={{ uri: product.thumbnail }}
                style={{ width: "100%", height: 250, borderRadius: 8 }}
                resizeMode="contain"
            />
            <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 8 }}>
                {product.title}
            </Text>
            <Text style={{ fontSize: 18, color: "green", marginBottom: 8 }}>
                ${product.price}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
                Rating: {product.rating} ⭐
            </Text>
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 16 }}>
                {product.description}
            </Text>
            <Button title="Add to Cart" onPress={handleAddToCart} />
            <View style={{ marginTop: 16 }}>
                <Button title="Go Back" onPress={() => router.back()} />
            </View>
        </ScrollView>
    );
};

export default ProductDetailsScreen;
