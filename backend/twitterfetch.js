import { Client } from "twitter-api-sdk";
import Express from "express";
const router = Express.Router();
import dotenv from "dotenv";
dotenv.config();

const oneWeekTimestamp = 604800000;

/* Definisco il client in application mode */
const client = new Client(process.env.bearertoken);

router.get("/search", async (req, res) => {
  try {
    let params = req.query;
    let today = Date.now();
    if (!params.query) {
      throw "Paramentri per la richiesta mancanti";
    }
    if (params.start_time && params.end_time) {
      if (Date.parse(params.start_time) > Date.parse(params.end_time)) {
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
    params["tweet.fields"] = [
      "attachments",
      "author_id",
      "entities",
      "geo",
      "id",
      "text",
      "created_at"
    ];
    params["expansions"] = [
      "attachments.media_keys",
      "entities.mentions.username",
      "geo.place_id",
      "in_reply_to_user_id",
      "referenced_tweets.id",
      "referenced_tweets.id.author_id",
    ];
    params["media.fields"] = ["preview_image_url", "type", "url"];
    const response = await client.tweets.tweetsRecentSearch(params);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

export default router;
