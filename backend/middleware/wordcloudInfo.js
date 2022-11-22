import { languages } from "../utils/constants.js";


// npm install keyword-extractor
import keyword_extractor from "keyword-extractor";


// Lingua predefinita: la lingua del tweet non e' supportata da multilang-sentiment, essa viene forzata ad essere "en"
const defaultLang = "en";

// Middleware per la wordcloud dei tweet
export const getWordcloudInfo = (req, res, next) => {
  let result = [];
  const tweets = { ...req.payload.textTweets };
  const len = req.payload.textTweets.length;

  let words = [];

  for (let i = 0; i < len; i += 1) {
    // identifica la lingua del tweet
    let lang = defaultLang;
    if (languages.includes(req.payload.textTweets[i].lang)) {
      lang = tweets[i].lang;
    }

    let lang1 = lang;
    switch(lang) {
      case "it":
        lang1 = "italian";
        break;
      case "es":
        lang1 = "spanish";
        break;
      case "de":
        lang1 = "german";
      break;
      case "fr":
        lang1 = "french";
      break;
      case "pl":
        lang1 = "polish";
      break;
      case "nl":
        lang1 = "dutch";
      break;
      case "ro":
        lang1 = "romanian";
      break;
      case "ru":
        lang1 = "russian";
      break;
      case "pt":
        lang1 = "portuguese";
      break;
      case "sv":
        lang1 = "swedish";
      break;
      case "ar":
        lang1 = "arabic";
      break;
      case "fa":
        lang1 = "persian";
      break;
      default:
        lang1 = "english";
    }

    // funzione che estrae le parole chiave di un testo
    const extraction_result =
    keyword_extractor.extract(tweets[i].text,{
        language:lang1,
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: false

    });
    // inserisco tutte le parole chiave in un array
    words = words.concat(extraction_result);
  }

  // rimuovo le parole di lunghezza 1 (solitamente simboli/emoji)
  let words1 = [];
  for (let word of words) {
    if (word.length > 1) {
      words1.push({text: word, value: 0});
    }
  }
  words = words1;

  // conto per ogni parola chiave, quante volte compare nell'array
  const count = {};
  for (const element of words) {
    if (count[element.text]) {
      count[element.text] += 1;
    } else {
      count[element.text] = 1;
    }
  }

  // trasformo l'array in una lista di oggetti di forma: {text: "testo", value: valore}
  const arr = [];
  for (const key in count) {
    arr.push({text: key, value: count[key]});
  }
  
  // ordino l'array
  arr.sort((a,b) => b.value - a.value);
  //console.log(arr);

  /*  
      per passare solo una parte dell'array
      arr = arr.slice(0, fine); 
  */

  // restituisco l'array
  req.payload.wordcloudInfo = arr;

  next();
}