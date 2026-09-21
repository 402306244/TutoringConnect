// Exposes tutor profile information and allows tutors or admins to manage subject details.
import { Router } from "express";
import TutorProfile from "../models/TutorProfile.js";
import { authenticate, role } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  res.json(
    await TutorProfile.find()
      .populate("user", "name email role")
      .populate("subjects", "name"),
  );
});

router.get("/:id", async (req, res) => {
  res.json(
    await TutorProfile.findOne({ user: req.params.id })
      .populate("user", "name email role")
      .populate("subjects", "name"),
  );
});

router.put("/:id/profile", async (req, res) => {
  res.json(
    await TutorProfile.findOneAndUpdate(
      { user: req.params.id },
      { bio: req.body.bio, subjects: req.body.subjects || [] },
      { new: true },
    ),
  );
});

router.post("/admin/tutor-profile", role("admin"), async (req, res) => {
  res.json(
    await TutorProfile.findOneAndUpdate(
      { user: req.body.userId },
      { bio: req.body.bio || "", subjects: req.body.subjects || [] },
      { new: true, upsert: true },
    ),
  );
});

export default router;
