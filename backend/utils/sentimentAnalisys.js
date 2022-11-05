import { default as sentiment } from "multilang-sentiment";

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
    let sent = sentiment(tweets[i].text, tweets[i].lang);
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
