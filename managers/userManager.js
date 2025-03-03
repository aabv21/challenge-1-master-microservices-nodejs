// Models
import User from "../models/userModel.js";

/**
 * @function getUsers
 * @async
 * @description Get all users
 * @returns {Promise<Object>}
 */
const getUsers = async () => {
  const users = await User.find();
  return users;
};

/**
 * @function getUser
 * @async
 * @description Get a user by id
 * @param {string} userId - The id of the user
 * @returns {Promise<Object>}
 */
const getUser = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

/**
 * @function createUser
 * @async
 * @description Create a new user
 * @param {Object} userData - The data of the user
 * @returns {Promise<Object>}
 */
const createUser = async (userData) => {
  const user = await User.create(userData);

  // REMOVE password from user object
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

/**
 * @function updateUser
 * @async
 * @description Update a user by id
 * @param {string} userId - The id of the user
 * @param {Object} userData - The data of the user
 * @returns {Promise<Object>}
 */
const updateUser = async (userId, userData) => {
  const user = await User.updateOne({ _id: userId }, { $set: userData });
  return user;
};

/**
 * @function deleteUser
 * @async
 * @description Delete a user by id
 * @param {string} userId - The id of the user
 * @returns {Promise<Object>}
 */
const deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
  return { message: "User deleted" };
};

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
