import Express from "express";
const router = Express.Router();
import { startChess } from "../utils/chess.js"

router.get("/start", startChess)

/* ipotetico router.get("/viewBoard/:fen")
    prende la fen e con la libreria */

export default router;