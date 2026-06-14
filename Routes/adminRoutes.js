import express from "express";
import { adminLogin, getAllAdmins } from "../Controller/adminController.js";


const router = express.Router();

router.post("/login", adminLogin);
router.get("/all", getAllAdmins);

export default router;