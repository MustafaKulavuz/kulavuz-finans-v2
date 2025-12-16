import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true }, // Örn: Netflix, Kira, İnternet
  amount: { type: Number, required: true },
  billingDay: { type: Number, required: true }, // Ayın hangi günü? (1-31)
  category: { type: String, default: "Abonelik" },
  active: { type: Boolean, default: true }, // Abonelik hala devam ediyor mu?
});

export const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
