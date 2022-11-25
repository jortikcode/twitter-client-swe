import express, { json, urlencoded } from "express";
import cors from "cors";
import api from "./routers/twitterfetch.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "build")));

app.use("/api", api);

app.get("/chess", (req, res) => {
  res.sendFile(join(__dirname, "..", "sample", "chessSample.html"));
});

/* La route /* e' generica, fa match con ogni richiesta.
Express verifica le route in ordine di dichiarazione, quindi le route /api non verranno inglobate
poiche' dichiarate prima */
app.get("/*", (req, res) => {
  res.sendFile(join(__dirname, "build", "index.html"));
});
