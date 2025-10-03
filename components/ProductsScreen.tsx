// ProductsScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
} from "react-native";
import axios from "axios";
import { useCart } from "@/context/CartContext";

type Product = {
    id: number;
    title: string;
    price: number;
    rating: number;
    thumbnail: string;
};

export default function ProductsScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [total, setTotal] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const LIMIT = 30;
    const { addToCart } = useCart();

    const fetchProducts = useCallback(async (reset = false) => {
        try {
            if (loading || fetchingMore) return;
            if (reset) {
                setRefreshing(true);
                setSkip(0);
            } else {
                setLoading(true);
            }

            const currentSkip = reset ? 0 : skip;
            const res = await axios.get(`https://dummyjson.com/products?limit=${LIMIT}&skip=${currentSkip}`);
            const data = res.data;
            const fetched: Product[] = data.products.map((p: any) => ({
                id: p.id,
                title: p.title,
                price: p.price,
                rating: p.rating,
                thumbnail: p.thumbnail,
            }));

            if (reset) {
                setProducts(fetched);
                setSkip(LIMIT);
            } else {
                setProducts(prev => [...prev, ...fetched]);
                setSkip(prev => prev + LIMIT);
            }
            setTotal(data.total);
        } catch (err) {
            console.error("fetchProducts error:", err);
            Alert.alert("Error", "Failed to load products.");
        } finally {
            setLoading(false);
            setFetchingMore(false);
            setRefreshing(false);
        }
    }, [skip, loading, fetchingMore]);

    useEffect(() => {
        fetchProducts(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = () => {
        if (total !== null && products.length >= total) return;
        if (fetchingMore) return;
        setFetchingMore(true);
        fetchProducts(false);
    };

    const onRefresh = () => {
        fetchProducts(true);
    };

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => addToCart({ id: item.id, title: item.title, price: item.price, thumbnail: item.thumbnail }, 1)}
                >
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const ListFooter = () => {
        if (fetchingMore) return <ActivityIndicator style={{ margin: 12 }} />;
        if (total !== null && products.length >= total) return <Text style={{ textAlign: "center", padding: 12 }}>No more products</Text>;
        return null;
    };

    return (
        <View style={styles.container}>
            {loading && products.length === 0 ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 10 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={ListFooter}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    card: {
        flexDirection: "row",
        marginBottom: 12,
        backgroundColor: "#f8f8f8",
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
    },
    image: { width: 90, height: 90, borderRadius: 8, backgroundColor: "#eee" },
    info: { flex: 1, marginLeft: 12 },
    title: { fontSize: 16, fontWeight: "600" },
    price: { marginTop: 6, fontWeight: "700", color: "green" },
    rating: { marginTop: 6, color: "#666" },
    button: {
        marginTop: 8,
        alignSelf: "flex-start",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: "#007bff",
    },
    buttonText: { color: "#fff", fontWeight: "600" },
});
