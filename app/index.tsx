import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';



export default function Index() {
  const router = useRouter();

  return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Gradient Background */}
        <LinearGradient
            colors={['#FF8C42', '#FF6B35', '#FF5722']}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Top Logo/Title */}
          <Text style={styles.logoText}>LumaStore</Text>

          {/* Character / Product Image Container */}
          <View style={styles.imageContainer}>
            <View style={styles.imageCircle}>
              <Image
                  source={{
                    uri: 'https://i.pinimg.com/736x/09/8c/68/098c68ef387f3f3950f5b40183468656.jpg',
                  }}
                  style={styles.characterImage}
                  resizeMode="cover"
              />
            </View>
          </View>

          {/* Bottom Card */}
          <View style={styles.card}>
            {/*<View style={styles.dotsContainer}>*/}
            {/*  <View style={[styles.dot, styles.dotActive]} />*/}
            {/*  <View style={styles.dot} />*/}
            {/*  <View style={styles.dot} />*/}
            {/*</View>*/}

            <Text style={styles.title}>
              Your One-Stop Online Store
            </Text>

            <Text style={styles.description}>
              Shop the latest gadgets, fashion, accessories, and more—all in one place! Discover unbeatable deals, fast shipping, and top-rated products from around the world.
            </Text>

            {/* Get Started Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/(auth)/LoginScreen")}
                activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            {/* Bottom Indicator */}
            {/*<View style={styles.bottomIndicator} />*/}
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
  content: {
    flex: 1,
    paddingTop: 60,
  },
  logoText: {
    color: 'white',
    fontSize: 22,
    height:30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: -60,
    zIndex: 10,
  },
  imageCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  card: {
    top:60,
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 170,
    paddingBottom: 40,
    marginTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: '#FF6B35',
    width: 24,
  },
  title: {
    bottom:80,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 32,
  },
  description: {
    bottom:80,
    fontSize: 14,
    color: '#7A8A99',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  button: {
    bottom:80,
    backgroundColor: '#FF6B35',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#1F1F1F',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 20,
  },
});
