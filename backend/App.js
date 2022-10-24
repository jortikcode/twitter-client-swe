const express = require("express");
const cors = require("cors");
const path = require("path");
const api = require("./twitterfetch");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));
app.use("/api", api);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
