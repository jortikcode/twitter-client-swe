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
    const points = getPointsfromText(rows);
    const sortedPoints = points.sort((a, b) => { return b.points - a.points})
    return res.status(200).send(sortedPoints);
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
    const points = getPointsfromText(rows);
    return res.status(200).send(points);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

/* prende una lista di righe di punteggio e ritorna una lista di oggetti nomePolitico, punti */
function getPointsfromText(rows) {
  if (!rows) {
    throw new Error("Righe mancanti");
  }
  const list = [];
  for (let i = 0; i < rows.length; i += 1) {
    list[i] = {};
    let politic;
    let points;
    let splitted;
    if (rows[i].trim().split(/\s+/).length == 3) {
      splitted = rows[i].trim().split(/\s+/);
      for (const word of splitted) {
        if (word.match(/(\d+)/)) {
          points = parseInt(word);
        } else if (!word.match(/PUNTI|punti/)) {
          politic = word;
        }
      }
    } else {
      if (rows[i].includes(" PER ")) {
        splitted = rows[i].split(" PER ");
      }
      if (rows[i].includes(" - ")) {
        splitted = rows[i].split(" - ");
      }
      if (rows[i].includes(" A ")) {
        splitted = rows[i].split(" A ");
      }
      splitted[0] = splitted[0].replace(/O/g, 0);
      points = parseInt(splitted[0].match(/(\d+)/)[0]);
      if (splitted[0].includes("MALUS")) {
        points *= -1;
      }
      politic = splitted[1];
    }
    list[i].politic = politic;
    list[i].points = points;
  }
  return list;
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
          row.trim().split(/\s+/).length == 3) &&
        !(row.includes(":") || row.includes("NON "))
      ) {
        /* vado a considerare solo le righe di punteggio */
        rows.push(row);
      }
    }
  }
  return rows;
}

/* controlla se una riga è di punteggio */
function validRow(row) {
  return /(\d+|\d(O+)) (PUNTI|punti)/.test(row);
}
