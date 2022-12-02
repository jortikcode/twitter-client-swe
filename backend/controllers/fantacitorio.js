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
    const summedPoints = getSummedPoints(points);
    const sortedPoints = summedPoints.sort((a, b) => {
      return b.points - a.points;
    });
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

/* prende una lista di oggetti nomePoilitico, punti e somma i punti gruppati per nomePolitico */
function getSummedPoints(points) {
  const surnames = [];
  const fullNames = [];
  for (const entry of points) {
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
  for (const element of points) {
    if (surnames.includes(element.politic)) {
      console.log(`Primo if: ${element.politic}`);
      for (const fullName of fullNames) {
        if (fullName.includes(element.politic)) {
          console.log(`Prima: ${element.politic} | ${fullName}`);
          element.politic = fullName;
          console.log(`Dopo: ${element.politic} | ${fullName}`);
        }
      }
    }
  }
  const summedPoints = [];
  for (const element of points) {
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
          row.trim().split(/\s+/).length <= 4) &&
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
