import { roClient } from "../utils/twitterClient.js";
import { tweetsRecentSearch } from "./twitterfetch.js";

const client = roClient.v2;

export const weeklyPoints = async (req, res, next) => {
  try {
    const tweets = await tweetsRecentSearch("from:Fanta_citorio");
    return res.status(200).send(tweets);
    const rows = getRows(tweets.data);
    next()
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

function getRows(tweets) {
  if (!tweets) {
    throw new Error("Tweets mancanti");
  }
  const rows = tweets.split("\n");
  console.log(rows);
}
