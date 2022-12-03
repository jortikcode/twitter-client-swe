import { default as sentiment } from "multilang-sentiment";
import {
  languages,
  NEGATIVE_SENTIMENT,
  NEUTRAL_SENTIMENT,
  POSITIVE_SENTIMENT,
  TRESHOLD_SCORE,
} from "../utils/constants.js";

// Lingua predefinita: la lingua del tweet non e' supportata da multilang-sentiment, essa viene forzata ad essere "en"
const defaultLang = "en";

export function doSentiment(tweets) {
  if (!tweets) {
    throw new Error("Fornire dei tweet su cui fare la sentiment analysis");
  }
  const len = tweets.length;
  const tweetSentiment = new Array();

  let searchSentiment = {
    score: 0,
    comparative: 0,
    positives: 0,
    negatives: 0,
    neutrals: 0,
  };

  for (let i = 0; i < len; i += 1) {
    try {
      let lang = defaultLang;
      if (languages.includes(tweets[i].lang)) {
        lang = tweets[i].lang;
      }
      let partial = sentiment(tweets[i].text, lang);
      // Push delle info di sentiment nell'array dei sentimenti dei tweet
      let sentiment_type;
      if (partial.score > TRESHOLD_SCORE) {
        sentiment_type = POSITIVE_SENTIMENT;
      } else if (partial.score < TRESHOLD_SCORE) {
        sentiment_type = NEGATIVE_SENTIMENT;
      } else {
        sentiment_type = NEUTRAL_SENTIMENT;
      }

      tweetSentiment.push({
        score: partial.score,
        comparative: partial.comparative,
        sentiment: sentiment_type,
        positiveWords: partial.positive,
        negativeWords: partial.negative,
      });

      searchSentiment.comparative += partial.comparative;
      searchSentiment.score += partial.score;
      searchSentiment.positives += partial.positive.length;
      searchSentiment.negatives += partial.negative.length;
      searchSentiment.neutrals +=
        partial.tokens.length -
        (searchSentiment.positives + searchSentiment.negatives);
    } catch (error) {
      throw new Error("Errore della sentiment");
    }
  }

  searchSentiment.score /= len;
  searchSentiment.comparative /= len;

  return { tweetSentiment: tweetSentiment, searchSentiment: searchSentiment };
}
