import { default as sentiment } from "multilang-sentiment";
import { languages } from "../utils/constants.js";

// Lingua predefinita: la lingua del tweet non e' supportata da multilang-sentiment, essa viene forzata ad essere "en"
const defaultLang = "en";

export function doSentiment(tweets) {
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

      tweetSentiment.push({
        score: partial.score,
        comparative: partial.comparative,
      });

      searchSentiment.comparative += partial.comparative;
      searchSentiment.score += partial.score;
      searchSentiment.positives += partial.positive.length;
      searchSentiment.negatives += partial.negative.length;
      searchSentiment.neutrals +=
        partial.tokens.length -
        (searchSentiment.positives + searchSentiment.negatives);
    } catch (error) {
      throw new Error("Errore della sentiment: " + error);
    }
  }

  searchSentiment.score /= len;
  searchSentiment.comparative /= len;

  return { tweetSentiment: tweetSentiment, searchSentiment: searchSentiment };
}
