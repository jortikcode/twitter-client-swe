/* global process */
import { rwClient } from "./twitterClient.js";
import ChessImageGenerator from "chess-image-generator";
import uniqid from "uniqid";
import { unlink } from "node:fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import sleep from "sleep-promise";

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

const imageGenerator = new ChessImageGenerator();

/* funzione per far rispettare la struttura di un tweet */
const createMsg = (text, mediaId) => {
  const msg = {
    text: text,
    media: {
      media_ids: [mediaId],
    },
  };
  return msg;
};

/* funzione per iniziare una partita a scacchi se username è presente, oppure proseguirla se username manca */
export const chessTweet = async (gameFEN, validMoves, username) => {
  try {
    const mediaId = await createImageAndUpload(gameFEN);
    const msg = username
      ? `Partita di ${username}, se vuoi sfidarlo vota la prossima mossa:\n${validMoves}`
      : `Mosse valide:\n${validMoves}`;
    const tweetText = createMsg(msg.substring(0, MAX_LENGTH - 1), mediaId);

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

async function createImageAndUpload(gameFEN) {
  imageGenerator.loadFEN(gameFEN);
  const imgPath = join(__dirname, "..", "boards", `board${uniqid()}.png`);
  await imageGenerator.generatePNG(imgPath);
  await sleep(1000);
  const mediaId = await rwClient.v1.uploadMedia(imgPath);
  unlink(imgPath, (err) => {
    if (err) console.log(err);
    else {
      console.log(`Deleted file: ${imgPath}`);
    }
  });
  return mediaId;
}
