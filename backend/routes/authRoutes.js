import express from "express";
import {
  requiredSignIn,
  isAdmin,
} from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getAllStudents,
  getAllOrganizers,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

//get all students - admin
router.get("/students", requiredSignIn, isAdmin, getAllStudents);

//get all organizers - admin
router.get("/organizers", requiredSignIn, isAdmin, getAllOrganizers);

//logout function 
router.post("/logout", requiredSignIn, logoutUser);


export default router;
