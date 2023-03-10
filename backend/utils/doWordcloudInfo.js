import {
  extractorSupportedLanguages,
  maxWordsPerWordcloud,
} from "../utils/constants.js";
import keyword_extractor from "keyword-extractor";
import { sortByValue } from "./sort.js";

// Lingua predefinita per effettuare l'estrazione delle keyword
const defaultLang = "english";

export function doWordcloudInfo(tweets) {
  if (!tweets) {
    throw new Error("Fornire dei tweet per fare la word cloud");
  }
  const len = tweets.length;

  if (len === 0) {
    return [];
  }

  let words = [];

  for (let i = 0; i < len; i += 1) {
    // Ci ricaviamo la lingua del tweet per esteso, se non e' supportata, viene settata ad una lingua di default
    const language = extractorSupportedLanguages[tweets[i].lang] || defaultLang;
    // funzione che estrae le parole chiave di un testo
    const extraction_result = keyword_extractor.extract(tweets[i].text, {
      language,
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: false,
    });
    // inserisco tutte le parole chiave in un array
    words = words.concat(extraction_result);
  }

  // Rimozione delle parole di lunghezza 1 (solitamente simboli/emoji)
  const significantWords = words.flatMap((word) =>
    word.length === 1 ? [] : [word]
  );

  /* 
    Conteggio per ogni parola chiave, quante volte compare e restituiamo il risultato in un 
    array che ha elementi del tipo: parola: counter
    */
  const wordCounts = significantWords.reduce((infoAccumulator, word) => {
    infoAccumulator[word] = ++infoAccumulator[word] || 1;
    return infoAccumulator;
  }, []);

  let wordcloudInfoArray = [];
  // Trasformiamo l'array in un array di oggetti di forma: {text: "testo", value: valore}
  for (const word in wordCounts) {
    wordcloudInfoArray.push({ text: word, value: wordCounts[word] });
  }

  // Ordinamento dell'array e rimozione delle keyword con valori non significativi
  wordcloudInfoArray = sortByValue(wordcloudInfoArray);
  wordcloudInfoArray = wordcloudInfoArray.slice(0, maxWordsPerWordcloud);

  return wordcloudInfoArray;
}
