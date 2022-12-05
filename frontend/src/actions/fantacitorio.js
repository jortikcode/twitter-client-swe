import { CLEAR_FANTACITORIO, LOADING_FANTACITORIO, SCORES_SUCCESS, TEAM_SUCCESS, UPDATE_SCOREBOARD } from "./constants";
import appendQuery from 'append-query'
import { noMatches } from "./tweets";

const baseUrl = process.env.REACT_APP_BASE_API_URL;
const fantacitorioUrl = baseUrl + "/fantacitorio/";

export const teams = (data) => async (dispatch) => {
    let url = fantacitorioUrl;
    url += data.type === "keyword" ? "teamImages" : "teamUser";
    if (data.type === "username")
        url = appendQuery(url, `username=${data.username}`);
    if (data.maxResults && data.maxResults <= 100 && !data.token)
        url = appendQuery(url, `max_results=${data.maxResults}`);
    if (data.startDate)
        url = appendQuery(url, `start_time=${data.startDate}`);
    if (data.endDate)
        url = appendQuery(url, `end_time=${data.endDate}`);
    if (data.token)
        url = appendQuery(url, `pagination_token=${data.token}`);
    // Richiesta fetch alla API
    await fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json?.no_matches || json.error){
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
            dispatch(loadingFantacitorio(false));
        }else{
            // Aggiornamento stato con le nuove informazioni ottenute dalla richiesta fetch
            dispatch(teamSuccess(
                json.creationDates,
                json.users,
                json.types,
                json.medias,
                json.nextToken,
                json.previousToken
                ));
        }
    })
    .catch(e => {
        throw new Error("Errore HTTP");
    });
}

export const loadingFantacitorio = (isLoading) => {
    return ({
        type: LOADING_FANTACITORIO,
        payload: {
            isLoading
        }
    })
}

export const scores = (type) => async (dispatch) => {
    const url = fantacitorioUrl + `${type === "ranking" ? "ranking" : "weeklyPoints"}`;
    // Richiesta fetch alla API
    await fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json?.no_matches || json.error){
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
            dispatch(loadingFantacitorio(false));
        }else{
            // Aggiornamento stato con le nuove informazioni ottenute dalla richiesta fetch
            dispatch(scoreSuccess(
                json.data,
                json.bestSingleScore
            ));
        }
    })
    .catch(e => {
        throw new Error("Errore HTTP");
    });
}

export function updateScoreboardEntry(score, index = -1) {
    console.log(score);
    return ({
        type: UPDATE_SCOREBOARD,
        payload: {
            score,
            index
        }
    })
}

function scoreSuccess(
    data = [],
    bestSingleScore = {}
){
    return ({
        type: SCORES_SUCCESS,
        payload: {
            data,
            bestSingleScore
        }
    })
}


function teamSuccess(
    creationDates = [], 
    users = [],
    types = [], 
    medias = [],
    nextToken = "",
    previousToken = "")
{
    return ({
        type: TEAM_SUCCESS,
        payload: {
            creationDates,
            users,
            types,
            medias,
            nextToken,
            previousToken
        }
    })
}

export function clearFantacitorio(){
    return ({
        type: CLEAR_FANTACITORIO
    })
}