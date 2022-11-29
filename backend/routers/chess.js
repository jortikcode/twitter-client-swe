import Express from "express";
const router = Express.Router();
import { startChess } from "../utils/chess.js"

router.get("/start", startChess)

export default router;