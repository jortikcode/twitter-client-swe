import { Client } from "twitter-api-sdk";
import { addFields } from "./queryFields.js";
import { doSentiment } from "./doSA.js";
import { preparePayload } from "./customResponse.js";
import { app } from "../index.js";
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

/* Definisco il client in application mode */
const client = new Client(process.env.bearertoken);

/* Generatore di regole da aggiungere */
export const generateAddRule = (val, tag) => {
  const addRule = {
    add: [
      {
        // Valore della regola (cosa cerca)
        value: val,
        // Nome della regola
        tag: tag,
      },
    ],
  };
  return addRule;
};

/* Generatore di regole da eliminare */
export const generateDeleteRule = (ids) => {
  const del = {
    delete: {
      // ID della regola da cancellare
      ids: ids,
    },
  };
  return del;
};

/* Elimina tutte le regole presenti */
const deleteAllRules = async () => {
  const rules = await getRules();
  if (rules.data) {
    let ids = [];
    for (let i = 0; i < rules.data.length; i += 1) {
      ids.push(rules.data[i].id);
    }
    await addOrDeleteRules(generateDeleteRule(ids));
  }
};

/* Chiamata alle api v2 di twitter per avviare lo stream */
export const startStream = async () => {
  try {
    console.log("Start stream");
    await deleteAllRules();
    const stream = client.tweets.searchStream(addFields());
    for await (let tweet of stream) {
      const rule = tweet.matching_rules[0].tag;
      tweet.data = [tweet.data];
      const payload = preparePayload(tweet);
      const { tweetSentiment, searchSentiment } = doSentiment(
        payload.textTweets
      );
      payload["tweetSentiment"] = tweetSentiment;
      payload["searchSentiment"] = searchSentiment;
      for (let i = 0; i < app.locals.listeners[rule]?.length; i += 1) {
        sendTweet(app.locals.listeners[rule][i], payload);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/* Invia un messaggio tramite un socket */
const sendTweet = (socket, tweet) => {
  socket.emit("tweets", tweet);
};

/* Chiamata alle api di twitter di getRules */
const getRules = async () => {
  try {
    const response = await client.tweets.getRules();
    return response;
  } catch (error) {
    throw new Error("Twitter server error");
  }
};
/* Probabilmente : in_reply_to_tweet_id:{id-del-tweet-fatto-in-precedenza} */
/* tweet-specifico-generato-da-me forse: conversation_id:{id-del-tweet-fatto-in-precedenza} is:reply */
/* Chiamata alle api di twitter di addOrDeleteRules */
export const addOrDeleteRules = async (rules) => {
  try {
    verifyRules(rules);
    const response = await client.tweets.addOrDeleteRules(rules);
    return response;
  } catch (error) {
    throw new Error(
      "Non è stato possibile impostare le regole dello stream, riavviare la pagina"
    );
  }
};

/* Middleware per verificare che la richiesta sia corretta */
export const verifyRules = (rules) => {
  if (!rules.add && !rules.delete) {
    throw new Error("Manca il campo add o il campo delete");
  }
  if (rules.add) {
    for (let i = 0; i < rules.add.lenght; i += 1) {
      if (!rules.add[i].value || !rules.add[i].tag) {
        throw new Error("Manca il campo value o il campo tag");
      }
    }
  }
  if (rules.delete) {
    if (!rules.delete.ids) {
      throw new Error("Manca il campo ids");
    }
  }
  return;
};
