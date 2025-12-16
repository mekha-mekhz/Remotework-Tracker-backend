const stripe = require("../config/stripe");
const Plan = require("../models/plan");

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
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: plan.name,
            },
            unit_amount: amount * 100, // ₹ → paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/paymentsuccess`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    // ✅ IMPORTANT FIX
    return res.json({ id: session.id });

  } catch (err) {
    console.error("Stripe Error:", err);
    return res.status(500).json({
      error: "Failed to create checkout session",
      details: err.message,
    });
  }
};
