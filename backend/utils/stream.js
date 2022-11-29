import { ETwitterStreamEvent } from "twitter-api-v2";
import { app } from "../index.js";
import { addFields } from "./queryFields.js";
import { doSentiment } from "./doSA.js";
import { preparePayload } from "./customResponse.js";
import { roClient } from "./twitterClient.js";

const client = roClient.v2;

/* creo la stream ma non la connetto */
const params = addFields();
params["autoConnect"] = false;
let stream = client.searchStream(params);

/* Generatore di add rules */
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

/* Generatore di delete rules */
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
  const rules = await client.streamRules();
  if (rules.data) {
    const ids = [];
    rules.data.map((rule) => ids.push(rule.id));
    await client.updateStreamRules(generateDeleteRule(ids));
  }
};

/* funzione per connettere la stream */
export const startStream = async () => {
  console.log("start stream");
  await deleteAllRules();
  stream = await stream.connect({ autoReconnect: true, autoReconnectRetries: Infinity });
};

/* funzione per interrompere la connessione alla stream */
export const stopStream = () => {
  stream.close();
};

stream.on(
  /* quando si verifica un errore */
  ETwitterStreamEvent.ConnectionError,
  (err) => console.log("Connection error!", err)
);

stream.on(
  /* quando si chiude la stream di twitter */
  ETwitterStreamEvent.ConnectionClosed,
  () => console.log("Stream chiusa.")
);

stream.on(
  /* quando ricevo dati */
  ETwitterStreamEvent.Data,
  (tweet) => {
    const rule = tweet.matching_rules[0].tag;
    tweet.data = [tweet.data];
    const payload = preparePayload(tweet);
    const { tweetSentiment, searchSentiment } = doSentiment(payload.textTweets);
    payload["tweetSentiment"] = tweetSentiment;
    payload["searchSentiment"] = searchSentiment;
    payload["wordcloudInfo"] = doWordcloudInfo(payload.textTweets);
    for (let i = 0; i < app.locals.listeners[rule]?.length; i += 1) {
      sendTweet(app.locals.listeners[rule][i], payload);
    }
  }
);

/* Chiamata alle api di twitter di addOrDeleteRules */
export const addOrDeleteRules = async (rules) => {
  try {
    const response = await client.updateStreamRules(rules);
    return response;
  } catch (error) {
    throw new Error(
      "Non è stato possibile impostare le regole dello stream, riavviare la pagina"
    );
  }
};

/* Invia un messaggio tramite un socket */
const sendTweet = (socket, tweet) => {
  socket.emit("tweets", tweet);
};
