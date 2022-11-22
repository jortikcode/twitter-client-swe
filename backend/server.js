import { Server } from "socket.io";
import app from "./index.js";
import {
  startStream,
  addOrDeleteRules,
  generateAddRule,
  generateDeleteRule,
} from "./utils/stream.js";
import { Mutex } from "async-mutex";

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

/* faccio partire lo stream perchè rimarrà in idle fino a quando non si aggiungono regole */
startStream();

/* associa un oggetto al socket id e rimane in ascolto per iniziare lo stream */
io.on("connection", (socket) => {
  console.log("client connesso");
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
  socket.on("disconnect", async () => {
    await removeFromAllLists(socket);
    socket.disconnect();
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
