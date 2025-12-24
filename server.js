import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import photoRoutes from "./Routes/photoRoutes.js";
import userRoutes from "./Routes/userRoute.js";
import adminRoutes from "./Routes/adminRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb+srv://shobhitdamwala2_db_user:sh@cluster0.rgjhdbb.mongodb.net/?appName=Cluster0 ")
  .then(() => console.log("✅ MongoDB connected"));

const smsSchema = new mongoose.Schema({
  device_id: String,
  address: String,
  body: String,
  timestamp: Date,
  timestamp_ms: Number, // 🔥 ADD THIS
  type: String,
  createdAt: { type: Date, default: Date.now },
});

// 🔒 HARD DUPLICATE PREVENTION
smsSchema.index(
  { device_id: 1, address: 1, body: 1, timestamp_ms: 1 },
  { unique: true }
);

const Sms = mongoose.model("Sms", smsSchema);

app.post("/api/sms", async (req, res) => {
  try {
    await Sms.create({
      ...req.body,
      timestamp: new Date(req.body.timestamp),
      timestamp_ms: Number(req.body.timestamp_ms),
    });

    console.log("📩 SMS STORED:", req.body.body);
    res.json({ success: true });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ duplicate: true });
    }
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/sms", async (req, res) => {
  const smsList = await Sms.find().sort({ timestamp_ms: -1 }).limit(100);
  res.json(smsList);
});
app.use("/uploads", express.static("uploads"));
app.use("/api/photos", photoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin",adminRoutes);
app.listen(3000, "0.0.0.0", () =>
  console.log("🚀 Backend running on http://127.0.0.1:3000")
);
