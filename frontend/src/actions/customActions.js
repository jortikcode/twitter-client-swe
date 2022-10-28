import { 
    TOGGLE_COLOR_MODE,
    SEARCH_FAIL,
    SEARCH_SUCCESS,
    NO_MATCHES
} from './constants'

function isRetweet(tweet){
    if (tweet?.referenced_tweets)
        return tweet?.referenced_tweets[0]?.type === "retweeted" || false; 
}

/* Ritorna un array che contiene elementi del tipo
    {
        name: ...,
        username: ...
    }
    degli autori con id in authors_id
*/
function getAuthours(authors_id, allAuthors){
    let authors_info = []
    for (const author_id of authors_id){
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
            let authors_id = [];

            // Aggiornamento stato con le nuove informazioni ottenute dalla richiesta fetch
            dispatch(searchSuccess(
                json.data.map((tweet, index) => {
                    authors_id.push(tweet.author_id);
                    if (isRetweet(tweet)){
                        // Si tratta di un retweet, e' necessario accedere al testo completo in un altro modo
                        return json.includes.tweets[index]?.text;
                    }
                    return tweet.text
                }),
                json.data.map(tweet => {
                    return new Date(tweet.created_at)
                }),
                getAuthours(authors_id, json.includes.users)
                ));
            }
    })
    .catch(e => {
        throw new Error("Errore HTTP");
    });
}

function searchSuccess(textTweets = [], creationDates = [], users = {}){
    return ({
        type: SEARCH_SUCCESS,
        payload: {
            textTweets,
            creationDates,
            users
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