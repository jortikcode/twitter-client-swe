import { 
    TOGGLE_COLOR_MODE,
    SEARCH_SUCCESS,
    NO_MATCHES,
    TOGGLE_FILTERS,
    DATE_ERROR,
    LOADING,
    CLEAR_TWEETS
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


export const filtersAction = (filtersEnabled) => {
    return ({
        type: TOGGLE_FILTERS,
        payload: {filtersEnabled}
    });
}

// Azione in cui viene fatta la chiamata alla API /search passandone la parola chiave
export const searchAction = (data) => async (dispatch) => {
    // Richiesta fetch alla API
    await fetch(`/api/${data.type === "keyword" ? `search?query=${data.query}` : `tweets?username=${data.username}`}${data.startDate ? `&start_time=${ `${data.startDate}`}&end_time=${data.endDate}` : ``}`)
    .then(res => res.json())
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
                json.sentimentAnalysis,
                json.types,
                json.places,
                json.nextToken
                ));
            }
    })
    .catch(e => {
        throw new Error("Errore HTTP");
    });
}

export const clearTweets = () => {
    return {
        type: CLEAR_TWEETS
    }
}

export const loadingAction = (isLoading) => {
    return {
        type: LOADING,
        payload: {
            isLoading: isLoading
        }
    }
}

function searchSuccess(textTweets = [], creationDates = [], users = [], sentiments = [], types = [], places = [], nextToken = ""){
    return ({
        type: SEARCH_SUCCESS,
        payload: {
            textTweets,
            creationDates,
            users,
            sentiments,
            types,
            places,
            nextToken
        }
    });
}

export function noMatches(){
    return ({
        type: NO_MATCHES
    });
}