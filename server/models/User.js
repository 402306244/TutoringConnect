// Stores login information and the user's role.
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Passwords are stored as bcrypt hashes, never plain text.
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", schema);
