// Manages tutor availability slots and ensures only the correct tutor can edit them.
import { Router } from "express";
import Availability from "../models/Availability.js";
import { authenticate, role } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  const filter = {};
  if (req.user.role === "tutor") filter.tutor = req.user.id;
  if (req.query.tutor) filter.tutor = req.query.tutor;

  res.json(
    await Availability.find(filter)
      .populate("tutor", "name email")
      .sort({ date: 1, startTime: 1 }),
  );
});

router.post("/", role("tutor", "admin"), async (req, res) => {
  try {
    const tutor = req.user.role === "tutor" ? req.user.id : req.body.tutor;
    res.status(201).json(
      await Availability.create({
        tutor,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        available: true,
      }),
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const item = await Availability.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Availability not found." });
  if (req.user.role !== "admin" && String(item.tutor) !== String(req.user.id)) {
    return res.status(403).json({ message: "Access denied." });
  }
  await item.deleteOne();
  res.json({ message: "Availability deleted." });
});

export default router;
