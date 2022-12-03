import { prepareFantacitorio } from "../utils/customResponse.js";
import { checkDates } from "../utils/dateCheck.js";
import { teamImagesFields } from "../utils/queryFields.js";
import {
  tweetsRecentSearch,
  getTweetFromUser,
  userIDByUsername,
} from "./twitterfetch.js";

export const ranking = async (req, res) => {
  try {
    const tweets = await getTweetFromUser(
      await userIDByUsername("Fanta_citorio"),
      { max_results: 100 }
    );
    const rows = getValidRows(tweets.data);
    const { list: points, bestSingleScore } = getPointsfromText(rows);
    const fullNames = getFullNames(points);
    const summedPoints = getSummedPoints(fullNames);
    const sortedPoints = summedPoints.sort((a, b) => {
      return b.points - a.points;
    });
    return res
      .status(200)
      .send({ data: sortedPoints, bestSingleScore: bestSingleScore });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};



export const weeklyPoints = async (req, res) => {
  try {
    const tweets = await tweetsRecentSearch("from:Fanta_citorio", {
      max_results: 100,
    });
    const rows = getValidRows(tweets.data);
    const { list: points, bestSingleScore } = getPointsfromText(rows);
    return res
      .status(200)
      .send({ data: points, bestSingleScore: bestSingleScore });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

/* prende una lista di oggetti nomePolitico, punti e restutisce la stessa lista dove il campo nomePolitico viene normalizzato */
function getFullNames(list) {
  const surnames = [];
  const fullNames = [];
  for (const entry of list) {
    /* prendo solamente quelli con solo il cognome o con il cognome di 2 parole */
    if (
      entry.politic.split(/\s+/).length == 1 ||
      entry.politic.match(/^.. /g)
    ) {
      surnames.push(entry.politic);
    } else {
      fullNames.push(entry.politic);
    }
  }
  for (const element of list) {
    if (surnames.includes(element.politic)) {
      for (const fullName of fullNames) {
        if (fullName.includes(element.politic)) {
          element.politic = fullName;
        }
      }
    }
  }
  return list;
}

/* prende una lista di oggetti nomePoilitico, punti e somma i punti gruppati per nomePolitico */
function getSummedPoints(list) {
  const summedPoints = [];
  for (const element of list) {
    if (element.politic in summedPoints) {
      summedPoints[element.politic] += element.points;
    } else {
      summedPoints[element.politic] = element.points;
    }
  }
  const obj = { ...summedPoints };
  const output = [];
  for (const key of Object.keys(obj)) {
    const row = {};
    row.politic = key;
    row.points = obj[key];
    output.push(row);
  }
  return output;
}

/* prende una lista di righe di punteggio e ritorna una lista di oggetti nomePolitico, punti */
function getPointsfromText(rows) {
  if (!rows) {
    throw new Error("Righe mancanti");
  }
  const bestSingleScore = { politc: "", points: 0 };
  const list = [];
  for (let i = 0; i < rows.length; i += 1) {
    list[i] = {};
    let politic;
    let points;
    if (rows[i].match(/OO/)) {
      rows[i] = rows[i].replace(/OO/, "00");
    }
    const words = rows[i].trim().split(" ");
    let j = 0;
    let prev;
    do {
      prev = words[j];
      j += 1;
    } while (words[j] != "PUNTI" && words[j] != "punti");
    points = parseInt(prev);
    if (rows[i].includes("MALUS")) {
      points *= -1;
    }
    politic = rows[i]
      .replace(
        /(\d+)|(PUNTI|punti)|( - )|( A )|( PER )|(ALTRI )|(\+)|(\(TOT\.)|(\))|(MALUS DI )/g,
        ""
      )
      .trim();

    list[i].politic = politic;
    list[i].points = points;
    if (points > bestSingleScore.points) {
      bestSingleScore.politc = politic;
      bestSingleScore.points = points;
    }
  }
  return { list, bestSingleScore };
}

/* prende tutti i tweet in input e ritorna una lista di righe di punteggio */
function getValidRows(tweets) {
  if (!tweets) {
    throw new Error("Tweets mancanti");
  }
  let rows = [];
  for (const tweet of tweets) {
    /* prendo tutte le righe dei tweet perchè un tweet può assegnare punti a diverse persone */
    const tweetRows = tweet.text.split("\n");
    /* per ogni riga controllo se è una riga di punti o di altro */
    for (const row of tweetRows) {
      if (
        validRow(row) &&
        (row.includes(" - ") ||
          row.includes(" PER ") ||
          row.includes(" A ") ||
          row.trim().split(/\s+/).length <= 4) &&
        !(row.includes(":") || row.includes("NON "))
      ) {
        /* vado a considerare solo le righe di punteggio */
        rows.push(row);
      } else if (
        row.includes(":") &&
        validRow(row) &&
        !row.includes("SQUADRE")
      ) {
        const politicians = getListOfPoliticians(
          tweetRows,
          tweetRows.indexOf(row)
        );
        for (const politc of politicians) {
          rows.push(row.replace(":", ` ${politc}`));
        }
      }
    }
  }
  return rows;
}

/* controlla se una riga è di punteggio */
function validRow(row) {
  return /(\d+|\d(O+)) (PUNTI|punti)/.test(row);
}

function getListOfPoliticians(tweetRows, index) {
  try {
    if (index == -1) {
      throw new Error("Indice non esistente");
    }
    const politicians = [];
    /* mi sposto sulla riga successiva che dovrebbe essere il primo nome della lista */
    index += 1;
    while (tweetRows[index] != "") {
      politicians.push(tweetRows[index]);
      index += 1;
    }
    return politicians;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const teamImages = async (req, res) => {
  try {
    let params = teamImagesFields(req.params);
    const tweets = await tweetsRecentSearch("#fantacitorio has:images", params);
    if (
      tweets?.meta?.result_count === 0 ||
      tweets?.includes?.media === undefined
    )
      // Non sono stati trovati tweet con immagini / non e' possibile ricavare le immagini
      return res.status(404).json({ no_matches: true });
    const response = prepareFantacitorio(tweets);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const teamUser = async (req, res) => {
  try {
    const { username: username, ...params } = teamImagesFields(req.params);
    if (!username) throw new Error("Username mancante");
    const tweets = await tweetsRecentSearch(
      `#fantacitorio from:${username} has:images`,
      params
    );
    if (
      tweets?.meta?.result_count === 0 ||
      tweets?.includes?.media === undefined
    )
      // Non sono stati trovati tweet con immagini / non e' possibile ricavare le immagini
      return res.status(404).json({ no_matches: true });
    const response = prepareFantacitorio(tweets);
    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const checkDataFantacitorio = (req, res, next) => {
  try {
    let params = req.query;
    checkDates(params.start_time, params.end_time);
    req.params = params;
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
