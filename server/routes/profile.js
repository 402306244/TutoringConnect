// Handles profile reads and updates for the currently logged-in user.
import { Router } from "express";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  res.json(await User.findById(req.user.id).select("-password"));
});

router.put("/", async (req, res) => {
  res.json(
    await User.findByIdAndUpdate(
      req.user.id,
      { name: req.body.name, email: req.body.email },
      { new: true },
    ).select("-password"),
  );
});

export default router;
