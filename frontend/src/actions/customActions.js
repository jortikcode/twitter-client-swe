import { 
    TOGGLE_COLOR_MODE,
    SEARCH_FAIL,
    SEARCH_SUCCESS,
    NO_MATCHES,
    TOGGLE_INTERVAL,
    DATE_ERROR,
} from './constants'

export const themeAction = (darkMode) => {
    return ({
        type: TOGGLE_COLOR_MODE,
        payload: {darkMode}
    });
}

export const dateErrorAction = (msg) => {
    return ({
        type: DATE_ERROR,
        payload: {msg}
    });
}


export const intervalSearchAction = (isIntervalEnabled) => {
    return ({
        type: TOGGLE_INTERVAL,
        payload: {isIntervalEnabled}
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
        if (json?.no_matches)
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
        else{
            // Aggiornamento stato con le nuove informazioni ottenute dalla richiesta fetch
            dispatch(searchSuccess(
                json.textTweets,
                json.creationDates,
                json.users,
                json.types
                ));
            }
    })
    .catch(e => {
        throw new Error("Errore HTTP");
    });
}

function searchSuccess(textTweets = [], creationDates = [], users = [], types = []){
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