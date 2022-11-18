import Express from "express";
const router = Express.Router();
import { tweetSentimentAnalysis, addTokens} from "../middleware/sentimentAnalisys.js";
import {
  searchRecent,
  prepareDataInput,
  prepareResponse,
  profilePicUrl,
  getUserID,
  searchUser
} from "../controllers/twitterfetch.js";

router.get(
  "/search",
  prepareDataInput,
  searchRecent,
  prepareResponse,
  profilePicUrl,
  tweetSentimentAnalysis,
  addTokens
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
  tweetSentimentAnalysis,
  addTokens
);

export default router;
