import Express from "express";
import { weeklyPoints, ranking } from "../controllers/fantacitorio.js";
const router = Express.Router();

router.get("/weeklyPoints", weeklyPoints);

router.get("/Ranking", ranking)

export default router;
