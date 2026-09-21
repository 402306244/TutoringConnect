// Handles booking creation, validation, rescheduling, and status updates.
import { Router } from "express";
import Availability from "../models/Availability.js";
import Booking from "../models/Booking.js";
import TutorProfile from "../models/TutorProfile.js";
import { authenticate, role } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  const filter = {};
  if (req.user.role === "student") filter.student = req.user.id;
  if (req.user.role === "tutor") filter.tutor = req.user.id;

  res.json(
    await Booking.find(filter)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .populate("subject", "name")
      .sort({ date: 1, startTime: 1 }),
  );
});

router.post("/", role("student"), async (req, res) => {
  try {
    const { tutor, subject, availability, date, startTime, endTime } = req.body;
    const slot = await Availability.findOne({
      _id: availability,
      tutor,
      date,
      startTime,
      endTime,
      available: true,
    });
    if (!slot) {
      return res.status(400).json({ message: "Availability is no longer available." });
    }

    const profile = await TutorProfile.findOne({ user: tutor });
    if (!profile || !profile.subjects.map(String).includes(String(subject))) {
      return res.status(400).json({ message: "Tutor is not assigned to this subject." });
    }

    const conflict = await Booking.findOne({
      tutor,
      date,
      status: { $in: ["Pending", "Confirmed"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    if (conflict) {
      return res.status(409).json({ message: "Tutor has a booking at this time." });
    }

    const booking = await Booking.create({
      student: req.user.id,
      tutor,
      subject,
      availability,
      date,
      startTime,
      endTime,
      sessionType: "Microsoft Teams",
      status: "Pending",
    });

    slot.available = false;
    await slot.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id/status", async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found." });

  const allowed =
    req.user.role === "admin" ||
    (req.user.role === "student" && String(booking.student) === String(req.user.id)) ||
    (req.user.role === "tutor" && String(booking.tutor) === String(req.user.id));
  if (!allowed) return res.status(403).json({ message: "Access denied." });

  booking.status = req.body.status;
  await booking.save();
  if (booking.status === "Cancelled") {
    await Availability.findByIdAndUpdate(booking.availability, { available: true });
  }
  res.json(booking);
});

router.put("/:id/reschedule", role("student"), async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, student: req.user.id });
  if (!booking) return res.status(404).json({ message: "Booking not found." });

  const slot = await Availability.findOne({
    _id: req.body.availability,
    tutor: booking.tutor,
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    available: true,
  });
  if (!slot) return res.status(400).json({ message: "New time is not available." });

  await Availability.findByIdAndUpdate(booking.availability, { available: true });
  slot.available = false;
  await slot.save();
  booking.availability = slot._id;
  booking.date = req.body.date;
  booking.startTime = req.body.startTime;
  booking.endTime = req.body.endTime;
  booking.status = "Pending";
  await booking.save();
  res.json(booking);
});

export default router;
