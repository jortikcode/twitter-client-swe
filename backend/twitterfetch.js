const Twitter = require("twitter-v2");
const router = require("express").Router();
require("dotenv").config();

/* Definisco il client in application mode */
const client = new Twitter({
  consumer_key: process.env.apikey,
  consumer_secret: process.env.apikeysecret,
  bearer_token: process.env.bearertoken,
});

router.get("/search", async (req, res, next) => {
  try {
    if (!req.query) {
      return next(new Error("Parametri per la richiesta mancanti"));
    }
    const params = req.query;
    const {
      data: tweets,
      meta,
      errors,
    } = await client.get("tweets/search/recent", params);
    res.send(tweets);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
