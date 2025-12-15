const { config } = require("dotenv");
const stripe = require("../config/stripe");
const Plan = require("../models/plan");
require("dotenv").config()
exports.createCheckoutSession = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ error: "planId is required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const amount = Number(plan.price);
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: "Invalid plan price" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: plan.name,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    // ✅ Stripe 2025 best practice
    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: err.message });
  }
};
