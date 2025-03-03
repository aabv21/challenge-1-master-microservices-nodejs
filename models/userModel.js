import mongoose from "mongoose";

// Utils
import { passCrypt } from "../utils/authUtils.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      select: false,
      validate: {
        validator: (email) => {
          const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return regexEmail.test(email);
        },
        message: (email) => `${email} is not a valid email address`,
      },
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  user.password = passCrypt.hashPassword(user.password);
  next();
});

const User = mongoose.model("User", userSchema);

User.ensureIndexes();
User.syncIndexes();

export default User;
