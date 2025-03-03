import { Router } from "express";

// Middlewares
import isAuthorized from "../middlewares/isAuthorized.js";
import validateUserData from "../middlewares/validateUserData.js";

// Controllers
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

// Private routes
router.get("/", isAuthorized, getUsers);
router.get("/:id", isAuthorized, getUser);
router.post("/", validateUserData, createUser);
router.put("/:id", isAuthorized, updateUser);
router.delete("/:id", isAuthorized, deleteUser);

export default router;
