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
import sleep from "sleep-promise";
import uniqid from "uniqid";
import { chessTweet, removeTweet } from "./utils/chess.js";

const mutex = new Mutex();

const port = 8000;
const server = app.listen(port);
if (!server) {
  process.exit(1);
}
console.log(`app listening on port ${port}!`);
/* IOStream */
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.locals.listeners = new Array();

app.locals.moves = new Array();

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
  socket.on("chess", async (gameFEN, validMoves, username) => {
    /* creo il tweet per la proposta della sfida */
    const tweetID = await chessTweet(gameFEN, validMoves, username);
    /* genero un tag unico */
    const tag = `chessRoomID ${uniqid()}`;
    try {
      /* creo la regola per rimanere in ascolto dei reply sotto al tweet postato in precedenza */
      await start(socket, `in_reply_to_tweet_id:${tweetID}`, tag);
      /* creo questa variabile globale per controllare se qualcuno risponde più volte */
      app.locals.moves[tag] = [];
      /* aspetto 2 minuto */
      await sleep(120000);
      /* smetto di ascoltare i reply */
      await stop(tag, socket);
      /* se non ha risposto nessuno mando una mossa casuale tra quelle possibili */
      if (app.locals.moves[tag].length == 0) {
        const randomMove =
          validMoves[Math.floor(Math.random() * validMoves.length)];
        socket.emit("tweets", randomMove);
      }
      /* invio al fronend che ho smesso di ascoltare e quindi può eseguire la mossa */
      socket.emit("tweets", "fin");
      /* smetto di controllare se qualcuno risponde più volte */
      delete app.locals.moves[tweetID];
      /* rimuovo il tweet */
      await removeTweet(tweetID);
    } catch (error) {
      console.log(error);
      /* smetto di controllare se qualcuno risponde più volte */
      delete app.locals.moves[tweetID];
      /* rimuovo il tweet */
      await removeTweet(tweetID);
    }
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
  console.log(JSON.stringify(activeRules));
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
