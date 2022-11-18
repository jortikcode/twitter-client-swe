import { default as sentiment } from "multilang-sentiment";
import { languages,
        NEGATIVE_SENTIMENT, 
        NEUTRAL_SENTIMENT, 
        POSITIVE_SENTIMENT, 
        TRESHOLD_SCORE } from "../utils/constants.js";

// Lingua predefinita: la lingua del tweet non e' supportata da multilang-sentiment, essa viene forzata ad essere "en"
const defaultLang = "en";

// Middleware per la sentiment analysis dei singoli tweet
export const tweetSentimentAnalysis = (req, res, next) => {
  let result = [];
  const tweets = { ...req.payload.textTweets };
  const len = req.payload.textTweets.length;
  let searchSentiment = {
    score: 0,
    comparative: 0,
    positives: 0,
    negatives: 0,
    neutrals: 0,
  };
  for (let i = 0; i < len; i += 1) {
    let lang = defaultLang;
    if (languages.includes(req.payload.textTweets[i].lang)) {
      lang = tweets[i].lang;
    }
    const tweetSentiment = sentiment(tweets[i].text, lang);

    // Aggiornamento del sentiment della ricerca
    searchSentiment.comparative += tweetSentiment.comparative;
    searchSentiment.score += tweetSentiment.score;

    searchSentiment.positives += tweetSentiment.positive.length;
    searchSentiment.negatives += tweetSentiment.negative.length;
    searchSentiment.neutrals +=
      tweetSentiment.tokens.length -
      (searchSentiment.positives + searchSentiment.negatives);

    // Push delle info di sentiment nell'array dei sentimenti dei tweet
    const sentiment_type = tweetSentiment.score > TRESHOLD_SCORE ? POSITIVE_SENTIMENT
                         : tweetSentiment.score < TRESHOLD_SCORE ? NEGATIVE_SENTIMENT
                         : NEUTRAL_SENTIMENT; 
    result.push({
      score: tweetSentiment.score,
      comparative: tweetSentiment.comparative,
      sentiment: sentiment_type,
      positiveWords: tweetSentiment.positive,
      negativeWords: tweetSentiment.negative
    });
  }
  // searchSentiment.score /= len;
  // searchSentiment.comparative /= len;
  req.payload["sentimentAnalysis"] = result;
  req.payload["searchSentimentAnalysis"] = searchSentiment;
  next();
};

export const addTokens = (req, res) => {
  res.status(200).json({
    ...req.payload,
    nextToken: req.nextToken,
    previousToken: req.previousToken
  });
};