import { default as sentiment } from "multilang-sentiment";
import { languages } from './constants.js'

export const removeTweetsNotSupported = (req, res, next) => {
  let payload = req.payload;
  for (let index = 0; index < payload.textTweets.length; index++){
    if (! languages.includes(payload.textTweets[index].lang)){
      payload.textTweets.splice(index, 1);
      payload.users.splice(index, 1);
      payload.creationDates.splice(index, 1);
      payload.types.splice(index, 1);
    }
  }
  next();
}


const sentimentAnalysis = (req, res, next) => {
  // tipo di oggetto che ritorna sentiment()
  let result = {
    score: 0,
    comparative: 0,
    positive: 0,
    negatives: 0,
    neutrals: 0,
  };
  const tweets = { ...req.payload.textTweets };
  const len = req.payload.textTweets.length;
  for (let i = 0; i < len; i += 1) {
    const sent = sentiment(tweets[i].text, tweets[i].lang);
    result.score += sent.score;
    result.comparative += sent.comparative;
    result.positive += sent.positive;
    result.negatives += sent.negatives;
    result.neutrals += sent.neutrals;
  }
  result.score /= len;
  result.comparative /= len;
  req.payload["sentimentAnalysis"] = result;
  res.status(200).json(req.payload);
};

export { sentimentAnalysis };
