import Express from "express";
import { weeklyPoints } from "../controllers/fantacitorio.js";
const router = Express.Router();

router.get("/weeklyPoints", weeklyPoints);

export default router;
