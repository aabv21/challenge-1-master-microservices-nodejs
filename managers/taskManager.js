import mongoose from "mongoose";

// Errors
import { NotFoundError, ForbiddenError } from "../utils/errorUtils.js";

// Models
import Task from "../models/taskModel.js";

/**
 * @async
 * @description Get a task by id
 * @param {string} taskId - The id of the task
 * @param {string} userId - The id of the user
 * @returns {Promise<Object>}
 */
const getTask = async (taskId, userId, filters) => {
  const pipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(taskId),
        author: new mongoose.Types.ObjectId(userId),
        ...filters,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "authorDetails",
        pipeline: [{ $project: { _id: 1, name: 1, email: 1 } }],
      },
    },
    { $unwind: "$authorDetails" },
    {
      $project: {
        title: 1,
        description: 1,
        status: 1,
        author: 1,
        authorDetails: 1,
      },
    },
  ];
  const result = await Task.aggregate(pipeline);
  const task = result?.[0];
  return task;
};

/**
 * @async
 * @description Create a new task
 * @param {string} userId - The id of the user
 * @param {Object} taskData - The task data
 * @returns {Promise<Object>}
 */
const createTask = async (userId, taskData) => {
  // Add the author to the task data
  taskData.author = userId;

  const newTask = await Task.create(taskData);
  return newTask;
};

/**
 * @async
 * @description Update a task by id
 * @param {string} taskId - The id of the task
 * @param {string} userId - The id of the user
 * @param {Object} taskData - The task data
 * @returns {Promise<Object>}
 */
const updateTask = async (taskId, userId, taskData) => {
  const task = await getTask(taskId, userId);
  if (!task) {
    throw new NotFoundError(`[updateTask] Task ${taskId} not found`);
  }

  if (task.author?.toString() !== userId) {
    throw new ForbiddenError(
      `[updateTask] User ${userId} are not authorized to update this task`
    );
  }

  const updatedTask = await Task.updateOne(
    { _id: taskId },
    {
      ...taskData,
      updatedAt: new Date(),
    }
  );
  return updatedTask;
};

/**
 * @async
 * @description Delete all tasks
 * @param {string} userId - The id of the user
 * @returns {Promise<Object>}
 */
const deleteAllTasks = async (userId) => {
  await Task.deleteMany({ author: userId });
  return { message: `All tasks of user ${userId} deleted` };
};

/**
 * @async
 * @description Delete a task by id
 * @param {string} taskId - The id of the task
 * @param {string} userId - The id of the user
 * @returns {Promise<Object>}
 */
const deleteTask = async (taskId, userId) => {
  const task = await getTask(taskId, userId);
  if (!task) {
    throw new NotFoundError(`[deleteTask] Task ${taskId} not found`);
  }

  if (task.author?.toString() !== userId) {
    throw new ForbiddenError(
      `[deleteTask] User ${userId} are not authorized to delete this task`
    );
  }

  await Task.findByIdAndDelete(taskId);
  return { message: `[deleteTask] Task ${taskId} deleted` };
};

// Tasks Search

/**
 * @async
 * @description Get all tasks with optional filters and search
 * @param {string} userId - The id of the user
 * @param {Object} options - Search and filter options
 * @returns {Promise<Array>}
 */
const getTasks = async (userId, options = {}) => {
  const {
    search,
    status,
    priority,
    startDate,
    endDate,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = options;

  const query = {
    author: userId,
    isInRecycleBin: false,
  };

  // Text search
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filters
  if (status) {
    query.status = status.toUpperCase();
  }
  if (priority) {
    query.priority = priority.toUpperCase();
  }
  if (startDate || endDate) {
    query.dueDate = {};
    if (startDate) query.dueDate.$gte = new Date(startDate);
    if (endDate) query.dueDate.$lte = new Date(endDate);
  }

  // Pagination
  const skip = (page - 1) * limit;

  try {
    // Execute query
    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(query), // Get total count
    ]);

    return {
      tasks,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        hasMore: skip + tasks.length < total,
      },
    };
  } catch (error) {
    throw new Error(`[getTasks] Error fetching tasks: ${error.message}`);
  }
};

// Recycle bin

/**
 * @async
 * @function moveTaskToRecycleBin
 * @description Move a task to the recycle bin
 * @param {string} taskId - The id of the task
 * @param {string} userId - The id of the user
 * @returns {Promise<Object>}
 */
const moveTaskToRecycleBin = async (taskId, userId) => {
  const task = await getTask(taskId, userId);
  if (!task) {
    throw new NotFoundError(`[moveTaskToRecycleBin] Task ${taskId} not found`);
  }

  if (task.author?.toString() !== userId) {
    throw new ForbiddenError(
      `[moveTaskToRecycleBin] User ${userId} are not authorized to move this task to the recycle bin`
    );
  }

  await Task.findByIdAndUpdate(taskId, { isInRecycleBin: true });
  return {
    message: `[moveTaskToRecycleBin] Task ${taskId} moved to recycle bin`,
  };
};

/**
 * @async
 * @function restoreTaskFromRecycleBin
 * @description Restore a task from the recycle bin
 * @param {string} taskId - The id of the task
 * @param {string} userId - The id of the user
 * @returns {Promise<Object>}
 */
const restoreTaskFromRecycleBin = async (taskId, userId) => {
  const task = await getTask(taskId, userId, { isInRecycleBin: true });
  if (!task) {
    throw new NotFoundError(
      `[restoreTaskFromRecycleBin] Task ${taskId} not found in recycle bin`
    );
  }

  if (task.author?.toString() !== userId) {
    throw new ForbiddenError(
      `[restoreTaskFromRecycleBin] User ${userId} are not authorized to restore this task`
    );
  }

  await Task.findByIdAndUpdate(taskId, { isInRecycleBin: false });
  return { message: `Task ${taskId} restored` };
};

export default {
  getTask,
  createTask,
  updateTask,
  deleteAllTasks,
  deleteTask,
  getTasks,
  moveTaskToRecycleBin,
  restoreTaskFromRecycleBin,
};
