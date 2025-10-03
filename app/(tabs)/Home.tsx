import React, { useEffect, useState, useContext } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    TextInput,
    SafeAreaView,
    ScrollView
} from "react-native";
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
    const [skip, setSkip] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserDoc | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    // @ts-ignore
    const { addToCart } = useContext(CartContext);


    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);
                getDoc(userRef)
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            setCurrentUser({ uid: snapshot.id, ...(snapshot.data() as UserDoc) });
                        }
                    })
                    .finally(() => setUserLoading(false));
            } else setUserLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const fetchProducts = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`https://dummyjson.com/products?limit=30&skip=${skip}`);
            const data = await res.json();
            setProducts(prev => [...prev, ...data.products]);
            setFilteredProducts(prev => [...prev, ...data.products]);
            setSkip(prev => prev + 30);
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    // Filter products by search
    useEffect(() => {
        let filtered = products;
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setFilteredProducts(filtered);
    }, [searchQuery, products]);

    const renderHeader = () => (
        <View style={styles.stickyHeader}>
            {/* User info */}
            <View style={styles.userSection}>
                {userLoading ? <ActivityIndicator color="#fff" /> :
                    <>
                        <Image
                            source={{ uri: currentUser?.photoURL || "https://via.placeholder.com/150" }}
                            style={styles.profilePic}
                        />
                        <View>
                            <Text style={styles.greeting}>
                                Hello, {currentUser?.fullName || "Guest"}!
                            </Text>
                            <Text style={styles.subGreeting}>Welcome to LumaStore</Text>
                        </View>
                    </>
                }
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Categories */}

        </View>
    );

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                <Text style={{ color: "#fff" }}>Add to Cart</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={filteredProducts}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                stickyHeaderIndices={[0]} // <-- Make header sticky
                ListHeaderComponent={renderHeader}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: "space-between", paddingHorizontal: 10 }}
                onEndReached={fetchProducts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#FF6B35" /> : null}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    stickyHeader: { backgroundColor: "#FF6B35", paddingBottom: 15, paddingTop: 10, zIndex: 10 },
    userSection: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, marginBottom: 10 },
    profilePic: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    greeting: { color: "#fff", fontWeight: "bold" },
    subGreeting: { color: "#fff", fontSize: 12 },
    searchContainer: { backgroundColor: "#fff", borderRadius: 10, marginHorizontal: 15, padding: 5, marginBottom: 10 },
    searchInput: { height: 35, paddingHorizontal: 10 },
    categoriesScroll: { paddingHorizontal: 15 },
    categoryCircle: { alignItems: "center", marginRight: 15 },
    categoryEmoji: { fontSize: 28 },
    categoryName: { fontSize: 12 },
    card: { width: "48%", backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 10 },
    cardImage: { width: "100%", height: 120, borderRadius: 10 },
    cardTitle: { marginTop: 5, fontWeight: "600" },
    price: { color: "#FF6B35", fontWeight: "bold" },
    rating: { marginTop: 3, fontSize: 12 },
    addButton: { marginTop: 5, backgroundColor: "#FF6B35", paddingVertical: 5, borderRadius: 8, alignItems: "center" },
});

export default HomeScreen;
