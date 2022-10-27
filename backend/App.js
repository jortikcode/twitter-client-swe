import express, { json, urlencoded } from "express";
import cors from "cors";
import { join } from "path";
import api from "./twitterfetch.js";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'build')));
app.use("/api", api);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
