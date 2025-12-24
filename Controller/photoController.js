import Photo from "../Model/Photo.js";

export const uploadPhotoOrVideo = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not received"
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required"
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/${req.file.path}`;

    const photo = await Photo.create({
      userId,
      url: fileUrl
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: photo
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all photos/videos of a user
export const getUserFiles = async (req, res) => {
  try {
    const { userId } = req.params;

    const files = await Photo.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: files
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
