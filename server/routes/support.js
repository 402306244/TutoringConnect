// Records support queries submitted by authenticated users.
import { Router } from "express";
import SupportQuery from "../models/SupportQuery.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

router.post("/", async (req, res) => {
  res.status(201).json(
    await SupportQuery.create({
      user: req.user.id,
      message: req.body.message,
    }),
  );
});

export default router;
