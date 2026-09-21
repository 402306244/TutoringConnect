// Stores tutor and platform ratings submitted by students and tutors.
import { Router } from "express";
import TutorRating from "../models/TutorRating.js";
import SystemRating from "../models/SystemRating.js";
import { authenticate, role } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.post("/tutor", role("student"), async (req, res) => {
  res.status(201).json(
    await TutorRating.create({
      student: req.user.id,
      tutor: req.body.tutor,
      booking: req.body.booking,
      rating: req.body.rating,
      comment: req.body.comment || "",
    }),
  );
});

router.post("/system", async (req, res) => {
  res.status(201).json(
    await SystemRating.create({
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment || "",
    }),
  );
});

export default router;
