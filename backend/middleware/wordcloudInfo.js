import { doWordcloudInfo } from "../utils/doWordcloudInfo.js";

// Middleware per la wordcloud dei tweet
export const getWordcloudInfo = (req, res, next) => {
  req.payload.wordcloudInfo = doWordcloudInfo(req.payload.textTweets);
  next();
}