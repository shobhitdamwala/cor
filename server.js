import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import photoRoutes from "./Routes/photoRoutes.js";
import userRoutes from "./Routes/userRoute.js";
import adminRoutes from "./Routes/adminRoutes.js";
import Admin from "./Model/Admin.js";

// Force Node.js to use Google DNS (fixes querySrv ECONNREFUSED/ENOTFOUND on some ISPs)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb+srv://shobhitdamwala_db_user:XWk0ff6Un0cdFzTk@cluster0.o289hcn.mongodb.net/?appName=Cluster0")
  .then(async () => {
    console.log("✅ MongoDB connected");
    try {
      const adminExists = await Admin.findOne({ username: "admin@gmail.com" });
      if (!adminExists) {
        await Admin.create({
          username: "admin@gmail.com",
          password: "admin@123",
        });
        console.log("👤 Default Admin (admin@gmail.com) Seeded successfully");
      }
    } catch (e) {
      console.error("❌ Error seeding default admin:", e.message);
    }
  });

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
    if (Array.isArray(req.body)) {
      const smsData = req.body.map(item => ({
        ...item,
        timestamp: new Date(item.timestamp),
        timestamp_ms: Number(item.timestamp_ms),
      }));

      try {
        await Sms.insertMany(smsData, { ordered: false });
      } catch (err) {
        // Ignore duplicate key errors in bulk insert
        const isOnlyDuplicates = err.code === 11000 || 
          (err.writeErrors && err.writeErrors.every(e => e.code === 11000));
        if (!isOnlyDuplicates) {
          throw err;
        }
      }

      console.log(`📩 Bulk SMS STORED: ${smsData.length} messages`);
      res.json({ success: true });
    } else {
      await Sms.create({
        ...req.body,
        timestamp: new Date(req.body.timestamp),
        timestamp_ms: Number(req.body.timestamp_ms),
      });

      console.log("📩 SMS STORED:", req.body.body);
      res.json({ success: true });
    }
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

// Delete all SMS by Device ID
app.delete("/api/sms/device/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const result = await Sms.deleteMany({ device_id: deviceId });
    res.json({ success: true, message: `Deleted ${result.deletedCount} messages` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete single SMS by ID
app.delete("/api/sms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Sms.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "SMS not found" });
    }
    res.json({ success: true, message: "SMS deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.use("/uploads", express.static("uploads"));
app.use("/api/photos", photoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin",adminRoutes);
app.listen(3000, "0.0.0.0", () =>
  console.log("🚀 Backend running on http://0.0.0.0:3000")
);
