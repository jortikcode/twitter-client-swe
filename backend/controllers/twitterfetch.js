import { Client } from "twitter-api-sdk";
import {
  searchSuccess,
  getType,
  getRetweetText,
  getAuthours,
  getGeo,
} from "../utils/customResponse.js";
import { oneWeekTimestamp } from "../utils/constants.js";
import isIsoDate from "../utils/dateCheck.js";
import dotenv from "dotenv";
dotenv.config();

/* Definisco il client in application mode */
const client = new Client(process.env.bearertoken);

export const searchUser = async (req, res, next) => {
  try {
    const id = req.userID;
    /* Devo escludere il campo username dai parametri se no
     non sono validi per la richiesta */
    let params = req.params;
    delete params.username;
    req.response = await client.tweets.usersIdTweets(id, params);
    if (req.response.meta.result_count == 0)
      // Non sono stati trovati risultati
      return res.status(200).json({ no_matches: true });
    next();
  } catch (error) {
    return res.status(500).send({ errore: "Errore HTTP " + error });
  }
};

export const searchRecent = async (req, res, next) => {
  try {
    const params = req.params;
    req.response = await client.tweets.tweetsRecentSearch(params);
    if (req.response.meta.result_count == 0)
      // Non sono stati trovati risultati
      res.status(404).json({ no_matches: true });
    else {
      next();
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

/* Middleware per prendere l'id dell'utente dal sul username */
export const getUserID = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      throw "Username mancante";
    }
    // Username dell'utente di cui ci interessano i tweets
    //Interrogazione della API all'URL https://api.twitter.com/2/users/by/username/:username
    const response = await client.users.findUserByUsername(username);
    if (response?.errors) {
      throw "Nessun utente trovato";
    }
    // id dell'utente risultante dalla richiesta
    const { id } = response.data;
    req.userID = id;
    next();
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

/* Middleware che controlla i dati per la successiva richiesta */
export const prepareDataInput = (req, res, next) => {
  try {
    let params = req.query;
    let today = Date.now();
    if (!params.query && !params.username) {
      throw "Paramentri per la richiesta mancanti";
    }
    if (params.start_time) {
      if (!isIsoDate(params.start_time)) {
        throw "Parametro start_time non valido";
      }
      const start = Date.parse(params.start_time);
      if (start < today - oneWeekTimestamp) {
        throw "Data di inizio non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }
    if (params.end_time) {
      if (!isIsoDate(params.end_time)) {
        throw "Parametro end_time non valido";
      }
      const end = Date.parse(params.end_time);
      if (end > today) {
        throw "Data di fine non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }
    if (params.start_time && params.end_time) {
      if (Date.parse(params.start_time) > Date.parse(params.end_time)) {
        throw "Date non valide, la data di inizio è dopo della data di fine";
      }
    }
    params["tweet.fields"] = [
      "attachments",
      "author_id",
      "entities",
      "geo",
      "id",
      "lang",
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
    req.params = { ...params };
    next();
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

/* Middleware che prepara la risposta */
export const prepareResponse = (req, res, next) => {
  // Array contenente gli id degli autori dei tweet ricevuti dalla richiesta
  let authorsId = [];
  // Array contenete i tipi dei tweet: TWEET, RETWEET, REPLY
  let types = [];
  // Array contenente i place id dei tweet
  let placesId = [];
  const { payload } = searchSuccess(
    req.response.data.map((tweet, index) => {
      authorsId.push(tweet.author_id);
      placesId.push(tweet?.geo?.place_id);
      types.push(getType(tweet));
      if (types[index] === "RETWEET") {
        // Si tratta di un retweet, e' necessario accedere al testo completo in un altro modo
        return getRetweetText(
          tweet.referenced_tweets[0].id,
          req.response.includes.tweets
        );
      }
      return { text: tweet.text, lang: tweet.lang };
    }),
    req.response.data.map((tweet) => {
      return new Date(tweet.created_at);
    }),
    getAuthours(authorsId, req.response.includes.users),
    types,
    getGeo(placesId, req.response.includes.places)
  );
  req.payload = payload;
  req.nextToken = req.response.meta.next_token;
  req.previousToken = req.response.meta.previous_token;
  next();
};

/* Middleware per le immagini di profilo degli utenti in users */
export const profilePicUrl = async (req, res, next) => {
  req.payload.users = await Promise.all(
    req.payload.users.map(async (userInfo) => {
      const pfpUrl = await client.users.findUserById(userInfo.id, {
        "user.fields": ["profile_image_url"],
      });
      return {
        ...userInfo,
        pfpUrl: pfpUrl.data.profile_image_url,
      };
    })
  );
  next();
};
