import { 
    TOGGLE_COLOR_MODE,
    SEARCH_FAIL,
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
    await fetch(`/api/search?query=${data.query}&start_time=${data.startDate}&end_time=${data.endDate}`)
    .then(res => {
        if (!res.ok)
            // Ricerca falllita
            return searchFail(); 
        else
            return res.json();  
    })
    .then(json => {
        if (json.meta.result_count === 0)
            dispatch(noMatches());
        else
            // Aggiornamento stato con le nuove informazioni ottenute dalla richiesta fetch
            dispatch(searchSuccess(
                json.data.map(tweet => tweet.text),
                json.data.map(tweet => new Date(tweet.created_at)),
                json.includes.users.map(user => {return {
                    name: user.name,
                    username: user.username
                }})));
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