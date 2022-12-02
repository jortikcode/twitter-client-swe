import { prepareTeamImages } from "../utils/customResponse.js";
import { checkDates } from "../utils/dateCheck.js";
import { teamImagesFields } from "../utils/queryFields.js";
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

export const teamImages = async (req, res) => {
  try {
    let params = teamImagesFields(req.params);
    const tweets = (await tweetsRecentSearch("#fantacitorio has:images", params));
    if (tweets?.meta?.result_count === 0 || (tweets?.includes?.media === undefined))
      // Non sono stati trovati tweet con immagini / non e' possibile ricavare le immagini
      return res.status(404).send({ error: error });
    const response = prepareTeamImages(tweets.includes.media);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

export const teamUser = async (req, res) => {
  return res.status(200).send({ temp: "TODO" });
}

export const checkDataFantacitorio = (req, res, next) => {
  try{
    let params = req.query;
    checkDates(params.start_time, params.end_time);
    req.params = params;
    next();
  } catch (error) {
    res.status(400).send({ error: error });
  }
}