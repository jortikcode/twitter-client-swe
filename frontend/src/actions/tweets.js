import { 
    TOGGLE_COLOR_MODE,
    SEARCH_SUCCESS,
    NO_MATCHES,
    TOGGLE_FILTERS,
    DATE_ERROR,
    LOADING,
    CLEAR_TWEETS,
    CLEAR_SCOREBOARD,
    UPDATE_CHAMPIONS
} from './constants'

const baseUrl = process.env.REACT_APP_BASE_API_URL;
const apiUrl = baseUrl + "/api/";

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

// Azione in cui viene fatta la chiamata alla API ghigliottina/solutions per ricevere i tweet con le soluzioni della ghigliottina
export const solutionsAction = () => async (dispatch) => {
    const url = apiUrl + 'ghigliottina/solutions';
    await fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json?.no_matches || json.error)
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
        else{
            dispatch(searchSuccess(
                json.textTweets,
                json.creationDates,
                json.users,
                [],
                {},
                json.types,
                [],
                [],
                "",
                ""
            ));
        }
    });
}

// Azione in cui viene fatta la chiamata alla API ghigliottina/champions?conversation_id=id
export const championsAction = (conversation_id, date) => async (dispatch) => {
    const url = apiUrl + `ghigliottina/champions?conversation_id=${conversation_id}`;
    await fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json?.no_matches || json.error)
            // Nessun risultato e' stato trovato
            dispatch(clearScoreboard());
        else{
            dispatch({
                type: UPDATE_CHAMPIONS,
                payload: {
                    championsString: json.championsString,
                    date: date
                }
            });
        }
    });    
}

export const clearScoreboard = () => {
    return {
        type: CLEAR_SCOREBOARD
    }
}

// Azione in cui viene fatta la chiamata alla API /search passandone la parola chiave
export const searchAction = (data) => async (dispatch) => {
    let url = apiUrl;
    const searchUrl = `search?query=${data.query}`;
    const tweetsUrl = `tweets?username=${data.username}`;
    const maxResults = `&max_results=${data.maxResults}`;
    const empty = ``;
    const startTimeEndTime = `&start_time=${data.startDate}&end_time=${data.endDate}`;
    const paginationToken = `&pagination_token=${data.token}` 
    url += `${data.type === "keyword" ? searchUrl : tweetsUrl}`;
    url += `${data.maxResults && data.maxResults <= 100 && !data.token ? maxResults : empty}`;
    url += `${data.startDate ? startTimeEndTime : empty}`;
    url += `${data.token ? paginationToken : empty}`;
    // Richiesta fetch alla API
    await fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json?.no_matches || json.error)
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
        else{
            // Aggiornamento stato con le nuove informazioni ottenute dalla richiesta fetch
            dispatch(searchSuccess(
                json.textTweets,
                json.creationDates,
                json.users,
                json.sentimentAnalysis,
                json.searchSentimentAnalysis,
                json.types,
                json.places,
                json.wordcloudInfo,
                json.nextToken,
                json.previousToken
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

function searchSuccess(textTweets = [], creationDates = [], users = [], sentiments = [], searchSentiment = {}, types = [], places = [], wordcloudInfo = [], nextToken = "", previousToken = ""){
    return ({
        type: SEARCH_SUCCESS,
        payload: {
            textTweets,
            creationDates,
            users,
            sentiments,
            searchSentiment,
            types,
            places,
            wordcloudInfo,  
            nextToken,
            previousToken
        }
    });
}

export function noMatches(){
    return ({
        type: NO_MATCHES
    });
}