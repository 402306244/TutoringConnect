// Stores support questions.
// No ticket status or response workflow is included because those were
// removed from the project requirements.
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("SupportQuery", schema);
