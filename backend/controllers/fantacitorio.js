import { tweetsRecentSearch } from "./twitterfetch.js";

export const weeklyPoints = async (req, res) => {
  try {
    const tweets = await tweetsRecentSearch("from:Fanta_citorio");
    const rows = getRows(tweets.data);
    console.log(rows);
    return res.status(200).send(tweets);
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
