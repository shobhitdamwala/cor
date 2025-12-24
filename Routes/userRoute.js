// routes/userRoutes.js
import express from "express";
import {
  createCourierOrder,
  addPersonalDetails,
  addPaymentDetails,
  getUserDetails,
  getAllUsers
} from "../Controller/userController.js";

const router = express.Router();

router.post("/create-order", createCourierOrder);
router.put("/personal/:userId", addPersonalDetails);
router.put("/payment/:userId", addPaymentDetails);
router.get("/getAllUser", getAllUsers);
router.get("/:userId", getUserDetails);


export default router;
