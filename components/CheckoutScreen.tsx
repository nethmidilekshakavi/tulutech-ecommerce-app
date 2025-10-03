// screens/CheckoutScreen.tsx
import React, { useState, useContext } from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { CartContext } from "@/context/CartContext";
import { useNavigation, useRoute } from "@react-navigation/native";

const CheckoutScreen = () => {
    const { confirmPayment } = useStripe();
    const { clearCart } = useContext(CartContext);
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const route: any = useRoute();
    const totalAmount = route.params.totalAmount || 0;

    const handlePay = async () => {
        if (!cardDetails?.complete) {
            Alert.alert("Error", "Enter complete card details");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalAmount * 100 }),
            });

            const { clientSecret } = await res.json();

            const { paymentIntent, error } = await confirmPayment(clientSecret, { type: "Card" });

            if (error) {
                Alert.alert("Payment Failed", error.message);
            } else if (paymentIntent) {
                clearCart();
                navigation.navigate("Success");
            }
        } catch (err: any) {
            Alert.alert("Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CardField
                postalCodeEnabled={false}
                placeholder={{ number: "4242 4242 4242 4242" }}
                cardStyle={{ backgroundColor: "#fff", textColor: "#000" }}
                style={{ width: "100%", height: 50, marginVertical: 30 }}
                onCardChange={(card) => setCardDetails(card)}
            />
            <Button title={`Pay $${totalAmount}`} onPress={handlePay} disabled={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
});

export default CheckoutScreen;
