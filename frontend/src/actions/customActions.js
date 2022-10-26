import { 
    TOGGLE_COLOR_MODE,
    SEARCH_FAIL,
    SEARCH_SUCCESS
} from './constants'

export const themeAction = (darkMode) => {
    return ({
        type: TOGGLE_COLOR_MODE,
        payload: {darkMode}
    });
}

// Azione in cui viene fatta la chiamata alla API /search passandone la parola chiave
export const keywordSearch = (query) => async (dispatch) => {
    const res = await fetch(`/api/search?query=${query}`)
    .then(res => {
        if (!res.ok)
            return searchFail(); 
        else
            return res.json();  
    })
    .then(json => {
        dispatch(searchSuccess(json.map(tweet => tweet.text)));
    })
    .catch(e => {
        throw new Error("Errore HTTP");
    });
}

function searchSuccess(tweets){
    return ({
        type: SEARCH_SUCCESS,
        payload: tweets
    });
}

function searchFail(){
    return ({
        type: SEARCH_FAIL
    });
}