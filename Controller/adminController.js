import Admin from "../Model/Admin.js";

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

  const admin = await Admin.findOne({ username, password });
    if (admin) {
        return res.json({ success: true, message: 'Login successful' });
    }else{
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 });
    res.json({ success: true, data: admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

