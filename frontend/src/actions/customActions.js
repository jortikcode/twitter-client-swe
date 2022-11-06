import { 
    TOGGLE_COLOR_MODE,
    SEARCH_SUCCESS,
    NO_MATCHES
} from './constants'

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

export function noMatches(){
    return ({
        type: NO_MATCHES
    });
}