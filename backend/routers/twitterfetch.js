import Express from "express";
const router = Express.Router();
import { sentimentAnalysis } from "../middleware/sentimentAnalisys.js";
import {
  searchRecent,
  prepareDataInput,
  prepareResponse,
  getUserID,
  searchUser,
  sendData,
} from "../controllers/twitterfetch.js";

router.get(
  "/search",
  prepareDataInput,
  searchRecent,
  prepareResponse,
  sentimentAnalysis,
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
  sendData
);

export default router;
