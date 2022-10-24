const express = require("express");
const cors = require("cors");
const api = require("./twitterfetch");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", api);

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
