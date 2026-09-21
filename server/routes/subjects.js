// Manages the list of tutoring subjects, including admin-only creation and updates.
import { Router } from "express";
import Subject from "../models/Subject.js";
import { authenticate, role } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  res.json(await Subject.find().sort({ name: 1 }));
});

router.post("/", role("admin"), async (req, res) => {
  try {
    res.status(201).json(
      await Subject.create({
        name: req.body.name,
        description: req.body.description || "",
      }),
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", role("admin"), async (req, res) => {
  res.json(await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/:id", role("admin"), async (req, res) => {
  await Subject.findByIdAndDelete(req.params.id);
  res.json({ message: "Subject deleted." });
});

export default router;
