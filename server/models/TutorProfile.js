// Tutor-specific profile information. Subjects links tutors to the subjects they teach.
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String, default: "", trim: true, maxlength: 2000 },
    qualifications: { type: [String], default: [] },
    profilePicture: { type: String, default: "", trim: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true },
);

export default mongoose.model("TutorProfile", schema);

