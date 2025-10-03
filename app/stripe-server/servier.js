const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const stripe = Stripe("sk_test_XXXXXXXXXXXXXXXX"); // Replace with your Stripe secret key

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
