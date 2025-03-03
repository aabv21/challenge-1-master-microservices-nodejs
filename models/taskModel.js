import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
      default: "PENDING",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isInRecycleBin: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

Task.ensureIndexes();
Task.syncIndexes();

export default Task;
