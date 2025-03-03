import { Router } from "express";

// Middlewares
import isAuthorized from "../middlewares/isAuthorized.js";
import validateTaskData from "../middlewares/validateTaskData.js";

// Controllers
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  moveTaskToRecycleBin,
  restoreTaskFromRecycleBin,
} from "../controllers/taskController.js";

const router = Router();

router.get("/:id", isAuthorized, getTask);
router.post("/", isAuthorized, validateTaskData, createTask);
router.put("/:id", isAuthorized, updateTask);
router.delete("/:id", isAuthorized, deleteTask);

// Tasks Search
router.get("/", isAuthorized, getTasks);

// Recycle bin
router.delete("/:id/recycle-bin/move", isAuthorized, moveTaskToRecycleBin);
router.post(
  "/:id/recycle-bin/restore",
  isAuthorized,
  restoreTaskFromRecycleBin
);

export default router;
