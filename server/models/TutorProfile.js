// Tutor-specific information.
// The subjects array represents Tutor <-> Subject assignment.
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    bio: { type: String, default: "" },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true },
);

export default mongoose.model("TutorProfile", schema);
