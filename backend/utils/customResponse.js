const REPLY = "REPLYTO";
const TWEET = "TWEET";
const RETWEET = "RETWEET";
const QUOTED = "QUOTED";
const NOTYPE = "NOTYPE";

// Funzione che ritorna il tipo del tweet passato come argomento
const getType = (tweet) => {
  if (tweet?.referenced_tweets)
    switch (tweet.referenced_tweets[0]?.type) {
      case "replied_to":
        return REPLY;
      case "retweeted":
        return RETWEET;
      case "quoted":
        return QUOTED;
      default:
        return NOTYPE;
    }
  return TWEET;
};

// Ritorna il testo (campo text) del retweet in allRetweets con id che vale retweetId
const getRetweetText = (retweetId, allRetweets) => {
  for (const retweet_extended of allRetweets)
    if (retweetId === retweet_extended.id) return {text: retweet_extended?.text, lang: retweet_extended?.lang};
  throw new Error("Retweet text not found");
};

/* Ritorna un array che contiene elementi del tipo
    {
    name: ...,
    username: ...
    }
    degli autori con id in authorsId
    */
const getAuthours = (authorsId, allAuthors) => {
  let authors_info = [];
  for (const author_id of authorsId) {
    authors_info.push(
      allAuthors.find((extended_author) => {
        return extended_author.id === author_id;
      })
    );
  }
  return authors_info;
};

const searchSuccess = (
  textTweets = [],
  creationDates = [],
  users = [],
  types = [],
  places = []
) => {
  return {
    type: "SEARCH_SUCCESS",
    payload: {
      textTweets,
      creationDates,
      users,
      types,
      places
    },
  };
};

/* Prende i placesID e il campo includes.places direttamente dalla risposta
  Ritorna un array con elementi del tipo: 
  {
    position: [int, int]
    index: int
  } 
  dove index e' l'indice del tweet le cui coordinate sono position */
const getGeo = (placesID, allPlaces) => {
  let placesInfo = []
  let index = 0;
  for (const placeId of placesID){
    if (! placeId)
      continue;
    const place = allPlaces.find((extended_place) => {
      return extended_place.id === placeId;
    })
    const placeCoords = place?.geo?.bbox; 
    const placeName = place?.name;
    if (placeCoords)
      // Poiche' le coordinate di twitter sono 2 (dovrebbe essere un'area di un rettangolo), ne prendiamo la media
      placesInfo.push({
        position: [(placeCoords[1] + placeCoords[3]) / 2, (placeCoords[0] + placeCoords[2]) / 2],
        name: placeName,
        index
      });
    index++;
  }
  return placesInfo;
};

const searchFail = () => {
  return {
    type: "SEARCH_FAIL",
  };
};

export default {
  searchFail,
  searchSuccess,
  getAuthours,
  getRetweetText,
  getType,
  getGeo,
};
