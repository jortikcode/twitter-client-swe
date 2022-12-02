import Express from "express";
import { weeklyPoints, teamImages, teamUser, checkDataFantacitorio } from "../controllers/fantacitorio.js";
const router = Express.Router();

router.get("/weeklyPoints", weeklyPoints);

router.get("/teamImages", checkDataFantacitorio, teamImages);

router.get("/teamUser", checkDataFantacitorio, teamUser);

export default router;
