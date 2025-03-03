// Managers
import taskManager from "../managers/taskManager.js";

// Errors
import { NotFoundError } from "../utils/errorUtils.js";

/**
 * @async
 * @function getTask
 * @route GET /api/v1/tasks/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the task is not found.
 * @returns {Promise<void>}
 */
export const getTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;
    const task = await taskManager.getTask(taskId, userId);
    if (!task) throw new NotFoundError(`Task ${taskId} not found`);
    return res.success(`Task ${taskId} fetched successfully`, 200, task);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to fetch task ${taskId}`,
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function createTask
 * @route POST /api/v1/tasks
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the task is not created.
 * @returns {Promise<void>}
 */
export const createTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const newTask = await taskManager.createTask(userId, req.body);
    return res.success(`Task created successfully`, 201, newTask);
  } catch (error) {
    return res.error(
      error?.message ?? "Failed to create task",
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function updateTask
 * @route PUT /api/v1/tasks/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the task is not updated.
 * @returns {Promise<void>}
 */
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;
    const updatedTask = await taskManager.updateTask(taskId, userId, req.body);
    return res.success(`Task ${taskId} updated successfully`, 200, updatedTask);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to update task ${taskId}`,
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function deleteTask
 * @route DELETE /api/v1/tasks/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the task is not deleted.
 * @returns {Promise<void>}
 */
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    await taskManager.deleteTask(taskId, req.user._id);
    return res.success(`Task ${taskId} deleted successfully`, 200);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to delete task ${taskId}`,
      error?.statusCode,
      error
    );
  }
};

// Tasks Search

/**
 * @async
 * @function getTasks
 * @route GET /api/v1/tasks
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 */
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await taskManager.getTasks(userId, req.query);

    return res.success("Tasks fetched successfully", 200, result);
  } catch (error) {
    return res.error(
      error?.message ?? "Failed to fetch tasks",
      error?.statusCode,
      error
    );
  }
};

// Recycle Bin

/**
 * @async
 * @function moveTaskToRecycleBin
 * @route DELETE /api/v1/tasks/:id/recycle-bin/move
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the task is not deleted.
 * @returns {Promise<void>}
 */
export const moveTaskToRecycleBin = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;
    await taskManager.moveTaskToRecycleBin(taskId, userId);
    return res.success(`Task ${taskId} moved to recycle bin`, 200);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to move task ${taskId} to recycle bin`,
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function restoreTaskFromRecycleBin
 * @route POST /api/v1/tasks/:id/recycle-bin/restore
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the task is not restored.
 * @returns {Promise<void>}
 */
export const restoreTaskFromRecycleBin = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;
    await taskManager.restoreTaskFromRecycleBin(taskId, userId);
    return res.success("Task restored successfully", 200);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to restore task ${taskId}`,
      error?.statusCode,
      error
    );
  }
};
