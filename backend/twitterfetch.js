const Twitter = require("twitter-v2");
const router = require("express").Router();
require("dotenv").config();

const oneWeekTimestamp = 604800000;

/* Definisco il client in application mode */
const client = new Twitter({
  consumer_key: process.env.apikey,
  consumer_secret: process.env.apikeysecret,
  bearer_token: process.env.bearertoken,
});

router.get("/search", async (req, res) => {
  try {
    const params = req.query;
    let today = Date.now();
    if (!params.query) {
      throw "Paramentri per la richiesta mancanti";
    }
    if(params.start_time && params.end_time){
      if(Date.parse(params.start_time) > Date.parse(params.end_time)){
        throw "Date non valide, la data di inizio è dopo della data di fine";
      }
    }
    if (params.start_time) {
      const start = Date.parse(params.start_time);
      if (start < today - oneWeekTimestamp) {
        throw "Data di inizio non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }

    if (params.end_time) {
      const end = Date.parse(params.end_time);
      if (end > today) {
        throw "Data di fine non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }
    const {
      data: tweets,
      meta,
      errors,
    } = await client.get("tweets/search/recent", params);
    res.send(tweets);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

module.exports = router;
