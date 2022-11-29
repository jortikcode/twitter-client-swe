/* global process */
import { Server } from "socket.io";
import { app } from "./index.js";
import {
  startStream,
  stopStream,
  addOrDeleteRules,
  generateAddRule,
  generateDeleteRule,
} from "./utils/stream.js";
import { Mutex } from "async-mutex";
import uniqid from "uniqid";
import { chessTweet } from "./utils/chess.js";

const mutex = new Mutex();

const port = 8000;
const server = app.listen(port);
if (!server) {
  process.exit(1);
}
console.log(`app listening on port ${port}!`);
/* IOStream */
const io = new Server(server);

app.locals.listeners = new Array();

const activeRules = new Array();

let connectCounter = 0;

/* associa un oggetto al socket id e rimane in ascolto per iniziare lo stream */
io.on("connection", async (socket) => {
  console.log("client connesso");
  let release = await mutex.acquire();
  if (connectCounter == 0) {
    /* faccio partire lo stream perchè rimarrà in idle fino a quando non si aggiungono regole */
    startStream();
  }
  connectCounter += 1;
  release();
  socket.on("startGenericStream", async (value, tag) => {
    await start(socket, value, tag);
  });
  socket.on("stopGenericStream", async (tag) => {
    await stop(tag, socket);
  });
  socket.on("startGhigliottina", async () => {
    await start(socket, "#leredita", "ghigliottina");
  });
  socket.on("stopGhigliottina", async () => {
    await stop("ghigliottina", socket);
  });
  socket.on("startChess", async (username) => {
    let release = await mutex.acquire();
    if (activeRules.length < 5) {
      const gameID = uniqid();
      const tweetID = await chessTweet(username);
      await addOrDeleteRules(
        generateAddRule(`in_reply_to_tweet_id:${tweetID}`, gameID)
      );
    } else {
      socket.emit("tweets", "sono già presenti 5 regole");
    }
    release();
  });
  socket.on("disconnect", async () => {
    let release = await mutex.acquire();
    await removeFromAllLists(socket);
    socket.disconnect();
    connectCounter -= 1;
    if (connectCounter == 0) {
      stopStream();
    }
    release();
    console.log("client disconnesso");
  });
});

/* Funzione generica per iniziare l'ascolto su uno stream */
const start = async (socket, value, tag) => {
  /* prendo la mutua esclusione per la variabile activeRules */
  let release = await mutex.acquire();
  /* controllo se è già presente una regola con il tag passato  */
  if (!(tag in activeRules)) {
    const rule = await addOrDeleteRules(generateAddRule(value, tag));
    app.locals.listeners[tag] = new Array();
    activeRules[tag] = rule.data[0].id;
  }
  if (!app.locals.listeners[tag].includes(socket)) {
    app.locals.listeners[tag].push(socket);
  }
  /* rilascio la mutua esclusione */
  release();
};

/* Funzione generica per fermare l'ascolto di uno stream */
const stop = async (tag, socket) => {
  await removeItem(tag, socket);
};

/* rimuove uno specifico socket da una lista */
const removeItem = async (tag, socket) => {
  if (tag in app.locals.listeners) {
    const index = app.locals.listeners[tag].indexOf(socket);
    if (index > -1) {
      app.locals.listeners[tag].splice(index, 1);
    }
    if (app.locals.listeners[tag].length == 0) {
      delete app.locals.listeners[tag];
      await addOrDeleteRules(generateDeleteRule([activeRules[tag]]));
      delete activeRules[tag];
    }
  }
};

/* rimuove un socket da tutte le liste in ascolto */
const removeFromAllLists = async (socket) => {
  for (const tag in app.locals.listeners) {
    await removeItem(tag, socket);
  }
};
