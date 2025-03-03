// Managers
import userManager from "../managers/userManager.js";

/**
 * @async
 * @function getUsers
 * @route GET /api/v1/users
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the users are not found.
 * @returns {Promise<void>}
 */
export const getUsers = async (req, res) => {
  try {
    const users = await userManager.getUsers();
    res.status(200).json({
      success: true,
      data: users,
      msg: "Users fetched successfully",
    });
  } catch (error) {
    return res.error(
      error?.message ?? "Failed to fetch users",
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function getUser
 * @route GET /api/v1/users/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the user is not found.
 * @returns {Promise<void>}
 */
export const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userManager.getUser(userId);
    return res.success(`User ${userId} fetched successfully`, 200, user);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to fetch user ${userId}`,
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function createUser
 * @route POST /api/v1/users
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the user is not created.
 * @returns {Promise<void>}
 */
export const createUser = async (req, res) => {
  try {
    const data = req.body;
    const user = await userManager.createUser(data);
    return res.success("User created successfully", 201, user);
  } catch (error) {
    return res.error(
      error?.message ?? "Failed to create user",
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function updateUser
 * @route PUT /api/v1/users/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const updateUser = async (req, res) => {
  try {
    // is userId is not the same as the userId in the request
    const data = req.body;
    const userId = req.params.id;
    if (req?.user?._id?.toString() !== userId) {
      return res.error(
        `User ${userId} are not allowed to update this user`,
        403
      );
    }

    const user = await userManager.updateUser(userId, data);
    if (!user) {
      return res.error("User not found", 404);
    }

    return res.success(`User ${userId} updated successfully`, 200, user);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to update user ${userId}`,
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function deleteUser
 * @route DELETE /api/v1/users/:id
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {Error} - If the user is not deleted.
 * @returns {Promise<void>}
 */
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log({ userId, req: req?.user?._id?.toString() });
  try {
    // is userId is not the same as the userId in the request
    if (req?.user?._id?.toString() !== userId) {
      return res.error(
        `User ${userId} are not allowed to delete this user`,
        403
      );
    }

    const user = await userManager.getUser(userId);
    if (!user) {
      return res.error("User not found", 404);
    }

    await userManager.deleteUser(userId);

    return res.success(`User ${userId} deleted successfully`, 200);
  } catch (error) {
    return res.error(
      error?.message ?? `Failed to delete user ${userId}`,
      error?.statusCode,
      error
    );
  }
};
