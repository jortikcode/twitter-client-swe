import { Client } from "twitter-api-sdk";
import Express from "express";
const router = Express.Router();
import dotenv from "dotenv";
import * as cr from "./utils/customResponse.js";
import fetch from 'node-fetch';

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
      "created_at",
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
    params["place.fields"] = [
      "contained_within",
      "country",
      "country_code",
      "full_name",
      "geo",
      "id",
      "name",
      "place_type",
    ];
    const response = await client.tweets.tweetsRecentSearch(params);
    if (response.meta.result_count == 0)
      // Non sono stati trovati risultati
      res.status(200).json({no_matches: true});
    else{
      // Array contenente gli id degli autori dei tweet ricevuti dalla richiesta
      let authorsId = [];
      // Array contenete i tipi dei tweet: TWEET, RETWEET, REPLY
      let types = [];
      const { payload } = cr.default.searchSuccess(
        response.data.map((tweet, index) => {
          authorsId.push(tweet.author_id);
          types.push(cr.default.getType(tweet));
          if (types[index] === "RETWEET") {
            // Si tratta di un retweet, e' necessario accedere al testo completo in un altro modo
            return cr.default.getRetweetText(
              tweet.referenced_tweets[0].id,
              response.includes.tweets
            );
          }
          return tweet.text;
        }),
        response.data.map((tweet) => {
          return new Date(tweet.created_at);
        }),
        cr.default.getAuthours(authorsId, response.includes.users),
        types
      );
      res.status(200).json(payload);
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

// TODO: generalizzare il codice duplicato che c'e' tra gli endpoint '/search' e '/tweets'

/* GET /api/tweets?username=string&start_time=string&end_time=string&max_results=int
}*/
router.get("/tweets", async (req, res) => {
  try{
    const { username } = req.query;
    const start_time = req.query?.start_time;
    const end_time = req.query?.end_time;
    const today = Date.now();
    if (! username)
      // Richiesta invalida
      return res.status(200).send({ error: "Richiesta non valida" });
    if (start_time && end_time) {
      if (Date.parse(start_time) > Date.parse(end_time)) {
        throw "Date non valide, la data di inizio è dopo della data di fine";
      }
    }

    if (start_time) {
      const start = Date.parse(start_time);
      if (start < today - oneWeekTimestamp) {
        throw "Data di inizio non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }

    if (end_time) {
      const end = Date.parse(end_time);
      if (end > today) {
        throw "Data di fine non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }
    let params = {};
    params["tweet.fields"] = [
      "attachments",
      "author_id",
      "entities",
      "geo",
      "id",
      "text",
      "created_at",
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
    params["place.fields"] = [
      "contained_within",
      "country",
      "country_code",
      "full_name",
      "geo",
      "id",
      "name",
      "place_type",
    ];
    // Username dell'utente di cui ci interessano i tweets 
    //Interrogazione della API all'URL https://api.twitter.com/2/users/by/username/:username
    let response = await client.users.findUserByUsername(username);

    if (response?.errors)
      // Richiesta invalida, utente non trovato o invalido
      return res.status(200).send({ error: "Utente invalido" });

    // id dell'utente risultante dalla richiesta
    const { id } = response.data;
    response = await client.tweets.usersIdTweets(id, params);
    if (response.meta.result_count == 0)
      // Non sono stati trovati risultati
      return res.status(200).json({no_matches: true});
    // Array contenete i tipi dei tweet: TWEET, RETWEET, REPLY
    let types = [];
    const { payload } = cr.default.searchSuccess(
      response.data.map((tweet, index) => {
        types.push(cr.default.getType(tweet));
        if (types[index] === "RETWEET") {
          // Si tratta di un retweet, e' necessario accedere al testo completo in un altro modo
          return cr.default.getRetweetText(
            tweet.referenced_tweets[0].id,
            response.includes.tweets
          );
        }
        return tweet.text;
      }),
      response.data.map((tweet) => {
        return new Date(tweet.created_at);
      }),
      [],
      types
    );
    return res.status(200).json(payload);
  }
  catch(error){
    return res.status(500).send({errore: "Errore HTTP " + error});
  }
})

export default router;
