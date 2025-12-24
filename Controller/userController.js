// controllers/userController.js
import User from "../Model/User.js";

export const createCourierOrder = async (req, res) => {
  try {
    const { courierCompany, trackingNumber } = req.body;

    if (!courierCompany || !trackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Courier company and tracking number are required"
      });
    }

    const user = await User.create({
      courierCompany,
      trackingNumber,
      username: `TEMP_${Date.now()}`,
      email: `temp_${Date.now()}@mail.com`,
      address: "TEMP",
      phoneno: 9999999999,
      payment: { paymentMethod: "UPI" } // temporary
    });

    res.status(201).json({
      success: true,
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



export const addPersonalDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, address, phoneno } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, address, phoneno },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Personal details added",
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



export const addPaymentDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentMethod } = req.body;

    let paymentData = { paymentMethod };

    if (paymentMethod === "DEBIT_CARD" || paymentMethod === "CREDIT_CARD") {
      paymentData.cardDetails = req.body.cardDetails;
      paymentData.netBankingDetails = undefined;
      paymentData.upiDetails = undefined;
    }

    if (paymentMethod === "NET_BANKING") {
      paymentData.netBankingDetails = req.body.netBankingDetails;
      paymentData.cardDetails = undefined;
      paymentData.upiDetails = undefined;
    }

    if (paymentMethod === "UPI") {
      paymentData.upiDetails = req.body.upiDetails;
      paymentData.cardDetails = undefined;
      paymentData.netBankingDetails = undefined;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { payment: paymentData },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "Payment details saved successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();  
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


