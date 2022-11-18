import { Client } from "twitter-api-sdk";
import app from "../index.js";
import dotenv from "dotenv";
dotenv.config();

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
  console.log("Start stream");
  await deleteAllRules();
  const stream = client.tweets.searchStream();
  for await (const tweet of stream) {
    for (const listener in app.locals.listeners) {
      sendTweet(app.locals.listeners[listener], tweet.data);
    }
  }
};

/* Invia un messaggio tramite un socket */
const sendTweet = (socket, tweet) => {
  socket.emit("tweets", tweet);
};

/* Chiamata alle api di twitter di getRules */
export const getRules = async () => {
  try {
    const response = await client.tweets.getRules();
    return response;
  } catch (error) {
    throw new Error("Twitter server error");
  }
};

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
