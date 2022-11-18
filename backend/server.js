import { Server } from "socket.io";
import app from "./index.js";
import {
  startStream,
  addOrDeleteRules,
  getRules,
  generateAddRule,
} from "./utils/stream.js";

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
  socket.on("startStream", async (value, tag) => {
    /* controllo se è già presente una regola con il tag passato  */
    if (!tag in activeRules) {
      const rule = await addOrDeleteRules(
        generateAddRule(value, tag)
      );
      activeRules[rule.data[0].tag] = rule.data[0].id;
    }
    app.locals.listeners[socket.id] = socket;
  });
  socket.on("stopStream", () => {
    if (socket.id in app.locals.listeners) {
      delete app.locals.listeners[socket.id];
    }
  });
  socket.on("disconnect", () => {
    if (socket.id in app.locals.listeners) {
      delete app.locals.listeners[socket.id];
    }
    socket.disconnect();
    console.log("Client disconnected");
  });
});
