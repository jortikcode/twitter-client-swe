import { rwClient } from "./twitterClient.js";

/* funzione per far rispettare la struttura di un tweet */
const createMsg = (text) => {
  const msg = {
    text: text,
  };
  return msg;
};

/* funzione per iniziare una partita a scacchi se username è presente, oppure proseguirla se username manca */
export const chessTweet = async (gameAscii, validMoves, username) => {
  try {
    const msg = username
      ? `${gameAscii}\nPartita iniziata da ${username}, se vuoi sfidarlo vota la prossima mossa:\n${validMoves}`
      : `${gameAscii}\nMosse valide:\n${validMoves}`;
    const tweetText = createMsg(msg);
    const { data: createdTweet } = await rwClient.v2.tweet(tweetText);
    return createdTweet.id;
  } catch (error) {
    console.log(error);
  }
};

export const removeTweet = async (tweetID) => {
  try {
    await rwClient.v2.deleteTweet(tweetID);
  } catch (error) {
    console.log(error);
  }
};
