import { Router } from "express";

// Middlewares
import isAuthorized from "../middlewares/isAuthorized.js";

// Controllers
import { login, logout } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/logout", isAuthorized, logout);
export default router;
