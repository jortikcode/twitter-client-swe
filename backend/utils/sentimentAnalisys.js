import { default as sentiment } from "multilang-sentiment";
import { languages } from './constants.js'

export const removeTweetsNotSupported = (req, res, next) => {
  let payload = req.payload;
  let index = 0;
  while (index < payload.textTweets.length){
    if (! languages.includes(payload.textTweets[index].lang) ){
      payload.textTweets.splice(index, 1);
      payload.users.splice(index, 1);
      payload.creationDates.splice(index, 1);
      payload.types.splice(index, 1);
      payload.places.splice(index, 1);
      continue;
    }
    index++;
  }
  next();
}


const sentimentAnalysis = (req, res, next) => {
  let result = [];
  const tweets = { ...req.payload.textTweets };
  const len = req.payload.textTweets.length;
  for (let i = 0; i < len; i += 1) {
    const sent = sentiment(tweets[i].text, tweets[i].lang);
    result.push({
      score: sent.score,
      comparative: sent.comparative
    });
  }
  req.payload["sentimentAnalysis"] = result;
  res.status(200).json(req.payload);
};

export { sentimentAnalysis };
