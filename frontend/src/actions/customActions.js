import { 
    TOGGLE_COLOR_MODE,
    SEARCH_FAIL,
    SEARCH_SUCCESS,
    NO_MATCHES
} from './constants'

import {
    REPLY,
    RETWEET,
    TWEET,
    NOTYPE
} from '../utils/constants'

// Funzione che ritorna il tipo del tweet passato come argomento
function getType(tweet){
    if (tweet?.referenced_tweets)
        switch (tweet.referenced_tweets[0]?.type){
            case 'replied_to':
                return REPLY;
            case 'retweeted':
                return RETWEET;
            default:
                return NOTYPE;
        }
    return TWEET;
}

// Ritorna il testo (campo text) del retweet in allRetweets con id che vale retweetId
function getRetweetText(retweetId, allRetweets){
    for (const retweet_extended of allRetweets)
        if (retweetId === retweet_extended.id)
            return retweet_extended?.text;
    throw new Error("Retweet text not found");
}

/* Ritorna un array che contiene elementi del tipo
    {
        name: ...,
        username: ...
    }
    degli autori con id in authorsId
*/
function getAuthours(authorsId, allAuthors){
    let authors_info = []
    for (const author_id of authorsId){
        authors_info.push(allAuthors.find(extended_author => {
            return extended_author.id === author_id;
        }))
    }
    return authors_info;
}

export const themeAction = (darkMode) => {
    return ({
        type: TOGGLE_COLOR_MODE,
        payload: {darkMode}
    });
}

// Azione in cui viene fatta la chiamata alla API /search passandone la parola chiave
export const searchAction = (data) => async (dispatch) => {
    // Richiesta fetch alla API
    await fetch(`/api/search?query=${data.query}${data.startDate ? `&start_time=${ `${data.startDate}`}&end_time=${data.endDate}` : ``}`)
    .then(res => {
        if (!res.ok)
            // Ricerca falllita
            return searchFail(); 
        else
            return res.json();  
    })
    .then(json => {
        if (json.meta.result_count === 0)
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
        else{
            // Array contenente gli id degli autori dei tweet ricevuti dalla richiesta
            let authorsId = [];
            // Array contenete i tipi dei tweet: TWEET, RETWEET, REPLY
            let types = [];

            // Aggiornamento stato con le nuove informazioni ottenute dalla richiesta fetch
            dispatch(searchSuccess(
                json.data.map((tweet, index) => {
                    authorsId.push(tweet.author_id);
                    types.push(getType(tweet));
                    if (types[index] === RETWEET){
                        // Si tratta di un retweet, e' necessario accedere al testo completo in un altro modo
                        return getRetweetText(tweet.referenced_tweets[0].id, json.includes.tweets);
                    }
                    return tweet.text
                }),
                json.data.map(tweet => {
                    return new Date(tweet.created_at)
                }),
                getAuthours(authorsId, json.includes.users),
                types
                ));
            }
    })
    .catch(e => {
        throw new Error("Errore HTTP");
    });
}

function searchSuccess(textTweets = [], creationDates = [], users = {}, types = []){
    return ({
        type: SEARCH_SUCCESS,
        payload: {
            textTweets,
            creationDates,
            users,
            types
        }
    });
}

function noMatches(){
    return ({
        type: NO_MATCHES
    });
}

function searchFail(){
    return ({
        type: SEARCH_FAIL
    });
}