import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Pressable,
    Alert,
    ActivityIndicator,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { login } from "@/services/authService";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const handleLogin = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const user = await login(email, password);
            console.log("Login success:", user);

            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();

            if (userData?.role === "admin") {
                router.push("/adminComporents/AdminDashBoard");
            } else {
                router.push("/(tabs)/Home");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Login failed", "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Hero Section with Shopping Image */}
            <View style={styles.heroSection}>
                <ImageBackground
                    source={{
                        uri: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800",
                    }}
                    style={styles.imageBackground}
                    imageStyle={styles.imageStyle}
                    resizeMode="cover"
                >
                    {/* Dark overlay with gradient effect */}
                    <View style={styles.overlay} />

                    {/* Decorative floating elements */}
                    <View style={styles.decorativeBox1}>
                        <Text style={styles.decorativeEmoji}>🛒</Text>
                    </View>
                    <View style={styles.decorativeBox2}>
                        <Text style={styles.decorativeEmoji}>🎉</Text>
                    </View>
                    <View style={styles.decorativeCircle}>
                        <Text style={styles.decorativeEmoji}>💰</Text>
                    </View>
                    <View style={styles.decorativeBox3}>
                        <Text style={styles.decorativeEmoji}>📦</Text>
                    </View>

                    {/* Logo and Title */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoBox}>
                            <Text style={styles.logoEmoji}>🛍️</Text>
                        </View>
                        <Text style={styles.brandTitle}>ShopNow</Text>
                        <Text style={styles.brandSubtitle}>Your Shopping Paradise</Text>
                    </View>

                    {/* Curved bottom */}
                    <View style={styles.curvedBottom} />
                </ImageBackground>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
                {/* Welcome Text */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
                    <Text style={styles.welcomeSubtitle}>
                        Sign in to explore amazing deals
                    </Text>
                </View>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.inputIcon}>📧</Text>
                        </View>
                        <TextInput
                            placeholder="your.email@example.com"
                            style={styles.textInput}
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.inputIcon}>🔐</Text>
                        </View>
                        <TextInput
                            placeholder="Enter your password"
                            style={styles.textInput}
                            placeholderTextColor="#9CA3AF"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                </View>

                {/* Remember Me & Forgot Password */}
                <View style={styles.optionsRow}>
                    <TouchableOpacity
                        style={styles.rememberMeContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        <View
                            style={[
                                styles.checkbox,
                                rememberMe && styles.checkboxChecked,
                            ]}
                        >
                            {rememberMe && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                        </View>
                        <Text style={styles.rememberText}>Remember Me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" size="large" />
                    ) : (
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>Or continue with</Text>
                    <View style={styles.dividerLine} />
                </View>

                {/* Social Login Buttons */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() =>
                            Alert.alert(
                                "Google Login",
                                "Google login functionality will be implemented here"
                            )
                        }
                    >
                        <Image
                            source={{
                                uri: "https://developers.google.com/identity/images/g-logo.png",
                            }}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() =>
                            Alert.alert(
                                "Facebook Login",
                                "Facebook login functionality will be implemented here"
                            )
                        }
                    >
                        <Image
                            source={{
                                uri: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png",
                            }}
                            style={styles.socialIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() =>
                            Alert.alert(
                                "Apple Login",
                                "Apple login functionality will be implemented here"
                            )
                        }
                    >
                        <Text style={styles.appleLogo}>🍎</Text>
                    </TouchableOpacity>
                </View>

                {/* Register Link */}
                <View style={styles.registerContainer}>
                    <Pressable onPress={() => router.push("/register")}>
                        <Text style={styles.registerText}>
                            Don't have an account?{" "}
                            <Text style={styles.registerLink}>Sign Up</Text>
                        </Text>
                    </Pressable>
                </View>

                {/* Features Section */}
                <View style={styles.featuresBox}>
                    <View style={styles.featureRow}>
                        <Text style={styles.featureEmoji}>🎁</Text>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>Special Offers</Text>
                            <Text style={styles.featureDescription}>
                                Up to 50% off on selected items
                            </Text>
                        </View>
                    </View>
                    <View style={styles.featureRow}>
                        <Text style={styles.featureEmoji}>🚀</Text>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>Fast Delivery</Text>
                            <Text style={styles.featureDescription}>
                                Free shipping on orders over $50
                            </Text>
                        </View>
                    </View>
                    <View style={styles.featureRow}>
                        <Text style={styles.featureEmoji}>🔒</Text>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>Secure Payment</Text>
                            <Text style={styles.featureDescription}>
                                100% safe and encrypted transactions
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    heroSection: {
        height: 380,
    },
    imageBackground: {
        flex: 1,
    },
    imageStyle: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
    },
    decorativeBox1: {
        position: "absolute",
        top: 60,
        right: 30,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 15,
        padding: 12,
        transform: [{ rotate: "15deg" }],
    },
    decorativeBox2: {
        position: "absolute",
        top: 140,
        left: 25,
        backgroundColor: "rgba(255, 152, 0, 0.2)",
        borderRadius: 15,
        padding: 10,
        transform: [{ rotate: "-10deg" }],
    },
    decorativeCircle: {
        position: "absolute",
        top: 80,
        right: 120,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 25,
        padding: 8,
    },
    decorativeBox3: {
        position: "absolute",
        top: 180,
        right: 50,
        backgroundColor: "rgba(255, 152, 0, 0.15)",
        borderRadius: 12,
        padding: 8,
        transform: [{ rotate: "20deg" }],
    },
    decorativeEmoji: {
        fontSize: 24,
    },
    logoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    logoBox: {
        backgroundColor: "rgba(255, 152, 0, 0.9)",
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        shadowColor: "#FF9800",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoEmoji: {
        fontSize: 40,
    },
    brandTitle: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#FFFFFF",
        marginBottom: 5,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    brandSubtitle: {
        fontSize: 16,
        color: "#FFFFFF",
        opacity: 0.95,
    },
    curvedBottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    formSection: {
        paddingHorizontal: 24,
        paddingBottom: 30,
    },
    welcomeContainer: {
        marginBottom: 30,
        marginTop: 10,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1F2937",
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 15,
        color: "#6B7280",
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    iconContainer: {
        marginRight: 12,
    },
    inputIcon: {
        fontSize: 20,
    },
    textInput: {
        flex: 1,
        color: "#1F2937",
        fontSize: 15,
        paddingVertical: 14,
    },
    optionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxChecked: {
        backgroundColor: "#FF9800",
        borderColor: "#FF9800",
    },
    checkmark: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    rememberText: {
        fontSize: 14,
        color: "#374151",
        fontWeight: "500",
    },
    forgotPassword: {
        fontSize: 14,
        color: "#FF9800",
        fontWeight: "600",
    },
    loginButton: {
        backgroundColor: "#FF9800",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 24,
        shadowColor: "#FF9800",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "bold",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E5E7EB",
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 13,
        color: "#9CA3AF",
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
        marginBottom: 30,
    },
    socialButton: {
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderColor: "#E5E7EB",
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    socialIcon: {
        width: 32,
        height: 32,
    },
    appleLogo: {
        fontSize: 32,
    },
    registerContainer: {
        alignItems: "center",
        paddingVertical: 16,
    },
    registerText: {
        fontSize: 15,
        color: "#6B7280",
    },
    registerLink: {
        color: "#FF9800",
        fontWeight: "bold",
    },
    featuresBox: {
        backgroundColor: "#FFF3E0",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#FFE0B2",
        marginTop: 8,
    },
    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    featureEmoji: {
        fontSize: 28,
        marginRight: 16,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 2,
    },
    featureDescription: {
        fontSize: 12,
        color: "#6B7280",
    },
});

export default LoginScreen;