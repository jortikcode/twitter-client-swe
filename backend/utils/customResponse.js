const REPLY = "REPLYTO";
const TWEET = "TWEET";
const RETWEET = "RETWEET";
const QUOTED = "QUOTED";
const NOTYPE = "NOTYPE";

export function preparePayload(response) {
  // Array contenente gli id degli autori dei tweet ricevuti dalla richiesta
  let authorsId = [];
  // Array contenete i tipi dei tweet: TWEET, RETWEET, REPLY
  let types = [];
  // Array contenente i place id dei tweet
  let placesId = [];
  const { payload } = searchSuccess(
    response.data.map((tweet, index) => {
      authorsId.push(tweet.author_id);
      placesId.push(tweet.geo?.place_id);
      types.push(getType(tweet));
      if (types[index] === "RETWEET") {
        // Si tratta di un retweet, e' necessario accedere al testo completo in un altro modo
        return getRetweetText(
          tweet.referenced_tweets[0].id,
          response.includes.tweets
        );
      }
      return { text: tweet.text, lang: tweet.lang, conversationId: tweet.conversation_id };
    }),
    response.data.map((tweet) => {
      return new Date(tweet.created_at);
    }),
    getAuthours(authorsId, response.includes.users),
    types,
    getGeo(placesId, response.includes.places),
  );
  return payload;
}

export function prepareFantacitorio(response){
  let index = 0
  // Array contenente gli id degli autori dei tweet ricevuti dalla richiesta
  let authorsId = [];
  // Array contenente elementi del tipo [media_keys]
  let mediaKeys = [];
  // Array delle date di creazione delle squadre
  let creationDates = [];
  // Array contenete i tipi dei tweet: TWEET, RETWEET, REPLY
  let types = [];

  for (const tweet of response.data){
    authorsId.push(tweet.author_id);
    types.push(getType(tweet));
    if (types[index] === "RETWEET") {
      // Si tratta di un retweet, e' necessario accedere all'immagine in un altro modo
      const { mediaKey: mediaKey } = getRetweetText(
        tweet.referenced_tweets[0].id,
        response.includes.tweets
      );
      mediaKeys.push(mediaKey);
    } else
      mediaKeys.push(tweet?.attachments?.media_keys[0]);
    creationDates.push(tweet.created_at);
    index++;
  }
  const { payload } = searchSuccess(
    [],
    creationDates,
    getAuthours(authorsId, response.includes.users),
    types,
    [],
    getMedias(mediaKeys, response.includes.media)
  );
  delete payload.textTweets;
  delete payload.places;
  return {
    ...payload,
    nextToken: response?.meta?.next_token,
    previousToken: response?.meta?.previous_token
  };
}

export const getMedias = (mediaKeys, allMedias) => {
  let mediasInfo = [];
  let index = 0;
  if (mediaKeys.length === 0 || !allMedias)
    return [];
  for (const mediaKey of mediaKeys){
    if (! mediaKey) {
      index++;
      continue;
    }
    const media = allMedias.find((extended_media) => {
      return extended_media.media_key === mediaKey;
    });
    if (media)
      mediasInfo.push({
        ...media,
        index
      });
    index++;
  }
  return mediasInfo;
}

// Funzione che ritorna il tipo del tweet passato come argomento
export const getType = (tweet) => {
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
export const getRetweetText = (retweetId, allRetweets) => {
  let retweetInfo = undefined;
  for (const retweet_extended of allRetweets)
    if (retweetId === retweet_extended.id){
      retweetInfo = { text: retweet_extended?.text, lang: retweet_extended?.lang };
      if (retweet_extended?.attachments?.media_keys)
        retweetInfo["mediaKey"] = retweet_extended.attachments.media_keys[0]
      break;
    }
  
  if (!retweetInfo)
    throw new Error("Retweet text not found");
  return retweetInfo;
};

/* Ritorna un array che contiene elementi del tipo
    {
    name: ...,
    username: ...
    }
    degli autori con id in authorsId
    */
export const getAuthours = (authorsId, allAuthors) => {
  const authors_info = [];
  for (const author_id of authorsId) {
    let author = allAuthors.find((extended_author) => {
      return extended_author.id === author_id;
    });
    author = { ...author, pfpUrl: author.profile_image_url };
    delete author.profile_image_url;
    authors_info.push(author);
  }
  return authors_info;
};

export const searchSuccess = (
  textTweets = [],
  creationDates = [],
  users = [],
  types = [],
  places = [],
  medias = []
) => {
  return {
    type: "SEARCH_SUCCESS",
    payload: {
      textTweets,
      creationDates,
      users,
      types,
      places,
      medias
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
export const getGeo = (placesID, allPlaces) => {
  let placesInfo = [];
  let index = 0;
  if (placesID.length === 0 || !allPlaces)
    return [];
  for (const placeId of placesID) {
    if (! placeId){
      index++;
      continue;
    }
    const place = allPlaces.find((extended_place) => {
      return extended_place.id === placeId;
    });
    const placeCoords = place?.geo?.bbox;
    const placeName = place?.name;
    if (placeCoords)
      // Poiche' le coordinate di twitter sono 2 (dovrebbe essere un'area di un rettangolo), ne prendiamo la media
      placesInfo.push({
        position: [
          (placeCoords[1] + placeCoords[3]) / 2,
          (placeCoords[0] + placeCoords[2]) / 2,
        ],
        name: placeName,
        index,
      });
    index++;
  }
  return placesInfo;
};

export const searchFail = () => {
  return {
    type: "SEARCH_FAIL",
  };
};
