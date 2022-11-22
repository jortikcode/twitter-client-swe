import Express from "express";
const router = Express.Router();
import { tweetSentimentAnalysis, searchSentimentAnalysis } from "../middleware/sentimentAnalisys.js";
import { getWordcloudInfo } from "../middleware/wordcloudInfo.js";
import {
  searchRecent,
  prepareDataInput,
  prepareResponse,
  profilePicUrl,
  getUserID,
  searchUser,
} from "../controllers/twitterfetch.js";

router.get(
  "/search",
  prepareDataInput,
  searchRecent,
  prepareResponse,
  profilePicUrl,
  getWordcloudInfo,
  searchSentimentAnalysis,
  tweetSentimentAnalysis
);

/* GET /api/tweets?username=string&start_time=string&end_time=string&max_results=int
}*/
router.get(
  "/tweets",
  prepareDataInput,
  getUserID,
  searchUser,
  prepareResponse,
  profilePicUrl,
  getWordcloudInfo,
  searchSentimentAnalysis,
  tweetSentimentAnalysis
);

export default router;
