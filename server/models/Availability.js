// A tutor's available date/time.
// A slot becomes unavailable after a successful booking.
import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Availability", schema);
