import { default as sentiment } from "multilang-sentiment";
import { languages } from "../utils/constants.js";

const defaultLang = "en";

export const tweetSentimentAnalysis = (req, res, next) => {
  let result = [];
  const tweets = { ...req.payload.textTweets };
  const len = req.payload.textTweets.length;
  for (let i = 0; i < len; i += 1) {
    let lang = defaultLang;
    if (languages.includes(payload.tweets[i].lang)) {
      lang = tweets[i].lang;
    }
    const sent = sentiment(tweets[i].text, lang);
    result.push({
      score: sent.score,
      comparative: sent.comparative,
    });
  }
  req.payload["sentimentAnalysis"] = result;
  res.status(200).json({
    ...req.payload,
    nextToken: req.nextToken,
    previousToken: req.previousToken,
  });
};

export const searchSentimentAnalysis = (req, res, next) => {
  const tweets = { ...req.payload.textTweets };
  const len = tweets?.length;
  if (len > 0) {
    let sentimentAnalysis = {
      score: 0,
      comparative: 0,
      positives: 0,
      negatives: 0,
      neutrals: 0,
    };
    for (let i = 0; i < len; i++) {
      try {
        let partial = sentiment(tweets[i].text, tweets[i].lang || defaultLang);
        sentimentAnalysis.comparative += partial.comparative;
        sentimentAnalysis.score += partial.score;

        sentimentAnalysis.positives += partial.positive.length;
        sentimentAnalysis.negatives += partial.negative.length;
        sentimentAnalysis.neutrals +=
          partial.tokens.length -
          (sentimentAnalysis.positives + sentimentAnalysis.negatives);
      } catch (error) {
        //console.log(error)
      }
    }

    sentimentAnalysis.score /= req.data.statuses.length;
    sentimentAnalysis.comparative /= req.data.statuses.length;

    req.payload.sentimentAnalysis = sentimentAnalysis;
    next();
  } else {
    next();
  }
};
