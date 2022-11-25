import { Client } from "twitter-api-sdk";
import { preparePayload } from "../utils/customResponse.js";
import { checkDates } from "../utils/dateCheck.js";
import { addFields } from "../utils/queryFields.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { argv } from 'node:process';
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (argv.length > 2)
  // Development enviroment variables
  dotenv.config({ path: join(__dirname, "..", ".env.development.tokens") });
else
  // Production enviroment variables
  dotenv.config({ path: join(__dirname, "..", ".env.production.tokens") });


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
    if (!params.query && !params.username) {
      throw "Paramentri per la richiesta mancanti";
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
  res.status(200).json({
    ...req.payload,
    nextToken: req.nextToken,
    previousToken: req.previousToken,
  });
};
