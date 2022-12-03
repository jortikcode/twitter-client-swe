/* global process */
import { rwClient } from "./twitterClient.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { default as turl } from 'turl';
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAX_LENGTH = 280;

if (process.argv.length > 2) {
  // Development enviroment variables
  dotenv.config({ path: join(__dirname, "..", ".env.development.tokens") });
}
// Production enviroment variables
else {
  dotenv.config({ path: join(__dirname, "..", ".env.production.tokens") });
}

/* funzione per far rispettare la struttura di un tweet */
const createMsg = (text) => {
  const msg = {
    text: text,
  };
  return msg;
};

/* funzione per iniziare una partita a scacchi se username è presente, oppure proseguirla se username manca */
export const chessTweet = async (gameFEN, validMoves, username) => {
  const boardurl = await turl.shorten(`${process.env.boardurl}?fen=${gameFEN}`);
  try {
    const msg = username
      ? `La board: ${boardurl}\nPartita di ${username}, se vuoi sfidarlo vota la prossima mossa:\n${validMoves}`
      : `\nMosse valide:\n${validMoves}`;
    const tweetText = createMsg(msg.substring(0, MAX_LENGTH - 1));
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
