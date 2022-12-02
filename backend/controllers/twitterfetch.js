import { roClient } from "../utils/twitterClient.js";
import { preparePayload } from "../utils/customResponse.js";
import { checkDates } from "../utils/dateCheck.js";
import { addFields } from "../utils/queryFields.js";

const client = roClient.v2;

export const searchUser = async (req, res, next) => {
  try {
    const id = req.userID;
    /* Devo escludere il campo username dai parametri se no
     non sono validi per la richiesta */
    let params = req.params;
    delete params.username;
    req.response = await client.user(id, params);
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
    const { query: query, ...params } = req.params;
    const response = await client.search(query, params);
    req.response = response._realData;
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

export const getChampionTweets = async (req, res, next) => {
  const params = req.query;
  if (!params.conversation_id)
    throw new Error(
      "Non e' stato specificato un tweet da cui ricavare i campioni!"
    );
  req.query.query = `(#leredita campioni) conversation_id:${params.conversation_id}`;
  // Al massimo 50 tweet con i vincitori del giorno
  req.query.max_results = "50";
  delete req.query.conversation_id;
  next();
};


export const getWinnerWordTweets = async (req, res, next) => {
  req.query.query = "(#ghigliottina #parola oggi) from:quizzettone";
  next();
};

export const processChampions = async (req, res, next) => {
  const { textTweets } = req.payload;
  let champions = [];
  champions = textTweets.map((tweet, index) => {
    if (index === (textTweets.length - 1))
      return tweet.text;
    return tweet.text.split(/campioni #leredita - \d*\n\n/i)[1];
  });
  champions.reverse();
  req.payload.champions = champions.join("\n");
  next();
};

/* Middleware per prendere l'id dell'utente dal sul username */
export const getUserID = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) {
      throw new Error("Username mancante");
    }
    // Username dell'utente di cui ci interessano i tweets
    //Interrogazione della API all'URL https://api.twitter.com/2/users/by/username/:username
    const response = await client.userByUsername(username);
    if (response?.errors) {
      throw new Error("Nessun utente trovato");
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
    if (!params.query && !params.username) {
      throw new Error("Paramentri per la richiesta mancanti");
    }
    checkDates(params.start_time, params.end_time);
    params = addFields(params);
    req.params = { ...params };
    next();
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

/* Middleware che prepara la risposta */
export const prepareResponse = (req, res, next) => {
  const payload = preparePayload(req.response);
  req.payload = payload;
  req.nextToken = req.response.meta.next_token;
  req.previousToken = req.response.meta.previous_token;
  next();
};

/* Middleware finale per mandare i dati in risposta */
export const sendData = (req, res) => {
  if (req.payload.champions)
    req.payload = {
      championsString: req.payload.champions,
    };
  res.status(200).json({
    ...req.payload,
    nextToken: req.nextToken,
    previousToken: req.previousToken,
  });
};
