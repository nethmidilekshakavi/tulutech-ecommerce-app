import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet, TextInput, SafeAreaView, ScrollView } from "react-native";
import { CartContext } from "@/context/CartContext";
import { db } from "@/config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface Product {
    id: number;
    title: string;
    price: number;
    rating: number;
    thumbnail: string;
    category: string;
}

type UserDoc = {
    uid: string;
    fullName?: string;
    email?: string;
    role?: string;
    photoURL?: string | null;
};

const HomeScreen = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserDoc | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { addToCart } = useContext(CartContext);

    // Categories with emojis - matching API categories
    const categories = [
        { name: "All", emoji: "🛍️" },
        { name: "beauty", emoji: "💄", displayName: "Beauty" },
        { name: "fragrances", emoji: "🌸", displayName: "Fragrances" },
        { name: "furniture", emoji: "🛋️", displayName: "Furniture" },
        { name: "groceries", emoji: "🥬", displayName: "Groceries" },
    ];

    // Fetch user details from Firebase
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            setCurrentUser({ uid: snapshot.id, ...(snapshot.data() as UserDoc) });
                        }
                    })
                    .catch((err) => {
                        console.error("Error fetching user profile:", err);
                    })
                    .finally(() => setUserLoading(false));
            } else {
                setUserLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Fetch products
    const fetchProducts = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`https://dummyjson.com/products?limit=30&skip=${skip}`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const text = await res.text();
            const data = text ? JSON.parse(text) : { products: [] };
            setProducts(prev => [...prev, ...data.products]);
            setFilteredProducts(prev => [...prev, ...data.products]);
            setSkip(prev => prev + 30);
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Filter by search and category
    useEffect(() => {
        let filtered = products;

        // Filter by category
        if (selectedCategory && selectedCategory !== "All") {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Filter by search
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [searchQuery, products, selectedCategory]);

    // Header Component
    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.location}>📍 Colombo, Sri Lanka</Text>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.userSection}>
                    {userLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : currentUser ? (
                        <>
                            <Image
                                source={{ uri: currentUser.photoURL || "https://via.placeholder.com/150" }}
                                style={styles.profilePic}
                            />
                            <View style={styles.welcomeSection}>
                                <Text style={styles.greeting}>
                                    Hello, {currentUser.fullName || "Guest"}!
                                </Text>
                                <Text style={styles.subGreeting}>
                                    Welcome to LumaStore
                                </Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <Image
                                source={{ uri: "https://via.placeholder.com/150" }}
                                style={styles.profilePic}
                            />
                            <View style={styles.welcomeSection}>
                                <Text style={styles.greeting}>
                                    Hello, Guest!
                                </Text>
                                <Text style={styles.subGreeting}>
                                    Explore LumaStore
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Categories Section */}
            <View style={styles.categoriesSection}>
                <View style={styles.categoriesHeader}>
                    <Text style={styles.categoriesTitle}>Categories</Text>
                    <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                        <Text style={styles.seeAllBtn}>See All</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.categoryCircle,
                                selectedCategory === category.name && styles.categoryCircleActive
                            ]}
                            onPress={() => setSelectedCategory(category.name === "All" ? null : category.name)}
                        >
                            <View style={[
                                styles.categoryIconContainer,
                                selectedCategory === category.name && styles.categoryIconActive
                            ]}>
                                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                            </View>
                            <Text style={[
                                styles.categoryName,
                                selectedCategory === category.name && styles.categoryNameActive
                            ]}>
                                {category.displayName || category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Description */}
            <View style={styles.descriptionBox}>
                <Text style={styles.description}>
                    Browse hundreds of products across electronics, fashion, home essentials, and more.
                    Get the best deals and shop with ease!
                </Text>
            </View>

            {/* Section Title */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                    {selectedCategory && selectedCategory !== "All"
                        ? `${categories.find(c => c.name === selectedCategory)?.displayName || selectedCategory} Products`
                        : "All Products"}
                </Text>
                <Text style={styles.productCount}>{filteredProducts.length} items</Text>
            </View>
        </View>
    );

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <Image
                source={{ uri: item.thumbnail }}
                style={styles.cardImage}
            />
            <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.cardDetails}>
                    <Text style={styles.price}>${item.price}</Text>
                    <View style={styles.ratingBox}>
                        <Text style={styles.rating}>⭐ {item.rating}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                >
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ListHeaderComponent={renderHeader}
                onEndReached={fetchProducts}
                onEndReachedThreshold={0.5}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={loading ? (
                    <View style={styles.footer}>
                        <ActivityIndicator size="large" color="#FF6B35" />
                    </View>
                ) : null}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f8f8' },
    listContent: { paddingBottom: 20 },
    header: {
        backgroundColor: '#FF6B35',
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    location: { color: '#fff', fontSize: 13, fontWeight: '500' },
    notificationBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    notificationIcon: { fontSize: 20 },
    userSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, minHeight: 55 },
    profilePic: { width: 55, height: 55, borderRadius: 28, borderWidth: 3, borderColor: '#fff', marginRight: 12 },
    welcomeSection: { flex: 1 },
    greeting: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 3 },
    subGreeting: { fontSize: 13, color: '#FFE5D9' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 },
    searchIcon: { fontSize: 18, marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: '#333' },

    // Categories
    categoriesSection: { paddingTop: 20, paddingBottom: 10, backgroundColor: '#fff', marginTop: 15, marginHorizontal: 15, borderRadius: 12, elevation: 1 },
    categoriesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 15 },
    categoriesTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    seeAllBtn: { fontSize: 14, color: '#FF6B35', fontWeight: '600' },
    categoriesScroll: { paddingHorizontal: 15, paddingBottom: 10 },
    categoryCircle: { alignItems: 'center', marginRight: 20 },
    categoryCircleActive: { transform: [{ scale: 1.05 }] },
    categoryIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFF5F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    categoryIconActive: {
        backgroundColor: '#FF6B35',
    },
    categoryEmoji: { fontSize: 30 },
    categoryName: { fontSize: 12, color: '#666', fontWeight: '500' },
    categoryNameActive: { color: '#FF6B35', fontWeight: '700' },

    descriptionBox: { paddingHorizontal: 20, paddingVertical: 18, backgroundColor: '#fff', marginTop: 15, marginHorizontal: 15, borderRadius: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    description: { fontSize: 14, color: '#666', lineHeight: 20, textAlign: 'center' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    productCount: { fontSize: 14, color: '#FF6B35', fontWeight: '600' },
    row: { justifyContent: 'space-between', paddingHorizontal: 15 },
    card: { width: '48%', backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, overflow: 'hidden' },
    cardImage: { width: '100%', height: 140, resizeMode: 'cover' },
    categoryBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,107,53,0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    categoryBadgeText: { fontSize: 10, color: '#fff', fontWeight: '600' },
    cardContent: { padding: 12 },
    cardTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, height: 38 },
    cardDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#FF6B35' },
    ratingBox: { backgroundColor: '#FFF5F2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    rating: { fontSize: 12, color: '#FF6B35', fontWeight: '600' },
    addButton: { backgroundColor: '#FF6B35', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    addButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    footer: { paddingVertical: 20, alignItems: 'center' },
});

export default HomeScreen;