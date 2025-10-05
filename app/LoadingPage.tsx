import React, { useEffect, useRef } from 'react';
import { View, Image, Animated, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LoadingPageProps {
    onFinish?: () => void;
}

export default function LoadingPage({ onFinish }: LoadingPageProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        console.log("LoadingPage mounted");

        // Smooth fade in animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 30,
                friction: 5,
                useNativeDriver: true,
            }),
        ]).start();

        // Navigate after 2.5 seconds
        const timer = setTimeout(() => {
            console.log("LoadingPage timer finished");
            if (onFinish) {
                onFinish();
            }
        }, 2500);

        return () => {
            console.log("LoadingPage cleanup");
            clearTimeout(timer);
        };
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1E40AF', '#3B82F6', '#60A5FA']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    {/* Tulu Tech Logo */}
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require('../assets/images/tulutech-logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Loading Text */}
                    <Text style={styles.loadingText}>Loading Tulu Tech...</Text>

                    {/* Simple Loading Animation */}
                    <View style={styles.loadingBar}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    transform: [{
                                        scaleX: fadeAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1]
                                        })
                                    }]
                                }
                            ]}
                        />
                    </View>
                </Animated.View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoWrapper: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        letterSpacing: 1,
    },
    loadingBar: {
        width: 200,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 2,
    },
});