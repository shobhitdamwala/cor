import express from "express";
import { upload } from "../middleware/upload.js";
import {
  uploadPhotoOrVideo,
  getUserFiles
} from "../Controller/photoController.js";

const router = express.Router();

router.post("/upload", upload.single("file"), uploadPhotoOrVideo);
router.get("/user/:userId", getUserFiles);

export default router;
