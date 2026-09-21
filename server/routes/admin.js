// Dashboard endpoints for administrators to manage users, subjects, bookings, and reports.
import { Router } from "express";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Booking from "../models/Booking.js";
import TutorRating from "../models/TutorRating.js";
import SystemRating from "../models/SystemRating.js";
import SupportQuery from "../models/SupportQuery.js";
import TutorProfile from "../models/TutorProfile.js";
import { authenticate, role } from "../middleware/auth.js";

const router = Router();
router.use(authenticate, role("admin"));

router.get("/users", async (req, res) => {
  res.json(await User.find().select("-password"));
});

router.put("/users/:id", async (req, res) => {
  res.json(
    await User.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, email: req.body.email, role: req.body.role },
      { new: true },
    ).select("-password"),
  );
});

router.get("/stats", async (req, res) => {
  res.json({
    users: await User.countDocuments(),
    students: await User.countDocuments({ role: "student" }),
    tutors: await User.countDocuments({ role: "tutor" }),
    subjects: await Subject.countDocuments(),
    bookings: await Booking.countDocuments(),
    pendingBookings: await Booking.countDocuments({ status: "Pending" }),
    completedBookings: await Booking.countDocuments({ status: "Completed" }),
  });
});

router.get("/support", async (req, res) => {
  res.json(await SupportQuery.find().populate("user", "name email").sort({ createdAt: -1 }));
});

router.get("/ratings", async (req, res) => {
  res.json({
    tutorRatings: await TutorRating.find(),
    systemRatings: await SystemRating.find(),
  });
});

router.post("/tutor-profile", async (req, res) => {
  res.json(
    await TutorProfile.findOneAndUpdate(
      { user: req.body.userId },
      { bio: req.body.bio || "", subjects: req.body.subjects || [] },
      { new: true, upsert: true },
    ),
  );
});

export default router;
