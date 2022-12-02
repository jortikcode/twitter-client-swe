import Express from "express";
const router = Express.Router();
import { sentimentAnalysis } from "../middleware/sentimentAnalisys.js";
import { getWordcloudInfo } from "../middleware/wordcloudInfo.js";
import { generateBoard } from '../middleware/chessImage.js'
import {
  searchRecent,
  prepareDataInput,
  prepareResponse,
  getUserID,
  searchUser,
  sendData,
  getWinnerWordTweets,
  getChampionTweets,
  processChampions,
} from "../controllers/twitterfetch.js";

router.get(
  "/search",
  prepareDataInput,
  searchRecent,
  prepareResponse,
  sentimentAnalysis,
  getWordcloudInfo,
  sendData
);

/* GET /api/tweets?username=string&start_time=string&end_time=string&max_results=int
}*/
router.get(
  "/tweets",
  prepareDataInput,
  getUserID,
  searchUser,
  prepareResponse,
  sentimentAnalysis,
  getWordcloudInfo,
  sendData
);

/* GET /api/ghigliottina/solutions */
router.get(
  "/ghigliottina/solutions",
  getWinnerWordTweets,
  prepareDataInput,
  searchRecent,
  prepareResponse,
  sendData
)

/* GET /api/ghigliottina/champions?conversation_id=id */
router.get(
  "/ghigliottina/champions",
  getChampionTweets,
  prepareDataInput,
  searchRecent,
  prepareResponse,
  processChampions,
  sendData
)

router.get(
  "/chessboard",
  generateBoard
)

export default router;
