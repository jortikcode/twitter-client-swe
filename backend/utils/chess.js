import { Client, auth } from "twitter-api-sdk";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { argv } from "node:process";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (argv.length > 2) {
  // Development enviroment variables
  dotenv.config({ path: join(__dirname, "..", ".env.development.tokens") });
}
// Production enviroment variables
else {
  dotenv.config({ path: join(__dirname, "..", ".env.production.tokens") });
}

const URL = process.env.URL || "http://localhost";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8000;

const authClient = new auth.OAuth2User({
  client_id: process.env.clientid,
  client_secret: process.env.clientsecret,
  callback: `${URL}:${PORT}/callback`,
  scopes: ["tweet.read", "tweet.write", "users.read"],
});
const client = new Client(authClient);

/* funzione per far rispettare la struttura di un tweet */
const createMsg = (text) => {
  const msg = {
    text: text,
  };
  return msg;
};

/* funzione per iniziare una partita a scacchi */
export const startChess = async (username) => {
  try {
    const tweetText = createMsg(
      `Partita iniziata da ${username}, se vuoi sfidarlo rispondi a questo tweet con la mossa che vuoi fare, sarà fatta la mossa scelta di più`
    );
    const response = await client.tweets.createTweet(tweetText);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
