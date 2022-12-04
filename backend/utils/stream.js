import { ETwitterStreamEvent } from "twitter-api-v2";
import { app } from "../index.js";
import { addFields } from "./queryFields.js";
import { doSentiment } from "./doSA.js";
import { doWordcloudInfo } from "./doWordcloudInfo.js";
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
    rules.data.forEach((rule) => {
      ids.push(rule.id);
    });
    await client.updateStreamRules(generateDeleteRule(ids));
  }
};

/* funzione per connettere la stream */
export const startStream = async () => {
  console.log("start stream");
  await deleteAllRules();
  stream = await stream.connect({
    autoReconnect: true,
    autoReconnectRetries: Infinity,
  });
};

/* Invia un messaggio tramite un socket */
const sendTweet = (socket, tweet) => {
  socket.emit("tweets", tweet);
};

/* Invia un messaggio a tutti gli ascoltatori */
const sendToListeners = (payload, rule) => {
  for (let i = 0; i < app.locals.listeners[rule]?.length; i += 1) {
    sendTweet(app.locals.listeners[rule][i], payload);
  }
};

/* prepara il tweet mossa da mandare */
const chessHandler = (tweet, rule) => {
  if (!app.locals.moves[rule].includes(tweet.data.author_id)) {
    app.locals.moves[rule].push(tweet.data.author_id);
    let payload = tweet.data.text;
    payload = payload.split(" ")[1];
    sendToListeners(payload, rule);
  }
};

/* prepara il tweet da mandare */
const tweetHandler = (tweet, rule) => {
  tweet.data = [tweet.data];
  const payload = preparePayload(tweet);
  const { tweetSentiment, searchSentiment } = doSentiment(payload.textTweets);
  payload["tweetSentiment"] = tweetSentiment;
  payload["searchSentiment"] = searchSentiment;
  payload["wordcloudInfo"] = doWordcloudInfo(payload.textTweets);
  sendToListeners(payload, rule);
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
    if (rule.startsWith("chessRoomID")) {
      chessHandler(tweet, rule);
    } else {
      tweetHandler(tweet, rule);
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
