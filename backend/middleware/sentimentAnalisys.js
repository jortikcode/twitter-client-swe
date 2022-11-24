import { doSentiment } from "../utils/doSA.js";

// Middleware per la sentiment analysis dei singoli tweet e della ricerca complessiva
export const sentimentAnalysis = (req, res, next) => {
  const { tweetSentiment, searchSentiment } = doSentiment(
    req.payload.textTweets
  );
  req.payload["sentimentAnalysis"] = tweetSentiment;
  req.payload["searchSentimentAnalysis"] = searchSentiment;
  next();
};
