import Express from "express";
const router = Express.Router();
import {
  sentimentAnalysis,
  removeTweetsNotSupported,
} from "../middleware/sentimentAnalisys.js";
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
  removeTweetsNotSupported,
  sentimentAnalysis
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
  removeTweetsNotSupported,
  sentimentAnalysis
);

export default router;
