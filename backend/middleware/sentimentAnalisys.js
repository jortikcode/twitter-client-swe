import { default as sentiment } from "multilang-sentiment";
import { languages } from "../utils/constants.js";

// Lingua predefinita: la lingua del tweet non e' supportata da multilang-sentiment, essa viene forzata ad essere "en"
const defaultLang = "en";

// Middleware per la sentiment analysis dei singoli tweet
export const tweetSentimentAnalysis = (req, res, next) => {
  let result = [];
  const tweets = { ...req.payload.textTweets };
  const len = req.payload.textTweets.length;
  for (let i = 0; i < len; i += 1) {
    let lang = defaultLang;
    if (languages.includes(req.payload.textTweets[i].lang)) {
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

// Middleware per la sentiment analysis complessiva della ricerca
export const searchSentimentAnalysis = (req, res, next) => {
  const tweets = req.payload.textTweets;
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
        let lang = defaultLang;
        if (languages.includes(tweets[i].lang)) {
          lang = tweets[i].lang;
        }
        let partial = sentiment(tweets[i].text, lang);
        sentimentAnalysis.comparative += partial.comparative;
        sentimentAnalysis.score += partial.score;

        sentimentAnalysis.positives += partial.positive.length;
        sentimentAnalysis.negatives += partial.negative.length;
        sentimentAnalysis.neutrals +=
          partial.tokens.length -
          (sentimentAnalysis.positives + sentimentAnalysis.negatives);
      } catch (error) {
        throw new Error("Errore della sentiment: " + error);
      }
    }
    sentimentAnalysis.score /= len;
    sentimentAnalysis.comparative /= len;
    req.payload.searchSentimentAnalysis = sentimentAnalysis;
    next();
  } else {
    next();
  }
};
