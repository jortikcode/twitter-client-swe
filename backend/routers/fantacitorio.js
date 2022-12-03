import Express from "express";
import {
  weeklyPoints,
  ranking,
  teamImages,
  teamUser,
  checkDataFantacitorio,
} from "../controllers/fantacitorio.js";
const router = Express.Router();

router.get("/weeklyPoints", weeklyPoints);

router.get("/ranking", ranking);
router.get("/teamImages", checkDataFantacitorio, teamImages);

router.get("/teamUser", checkDataFantacitorio, teamUser);

export default router;
