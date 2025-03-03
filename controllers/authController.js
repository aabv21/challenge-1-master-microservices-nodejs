// Managers
import authManager from "../managers/authManager.js";

/**
 * @async
 * @function login
 * @route POST /api/v1/auth/login
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @throws {Error} - If the user is not found or the password is invalid.
 * @returns {Promise<Object>}
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await authManager.login(email, password);
    return res.success("Login successful", 200, token);
  } catch (error) {
    return res.error(
      error?.message ?? "Login failed",
      error?.statusCode,
      error
    );
  }
};

/**
 * @async
 * @function logout
 * @route POST /api/v1/auth/logout
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<Object>}
 */
export const logout = async (req, res) => {
  const { userId } = req.body;
  try {
    await authManager.logout(userId);
    return res.success("Logout successful", 200);
  } catch (error) {
    return res.error(
      error?.message ?? "Logout failed",
      error?.statusCode,
      error
    );
  }
};
