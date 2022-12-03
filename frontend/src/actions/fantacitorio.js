import { SCORES_SUCCESS, TEAM_SUCCESS } from "./constants";
import { noMatches } from "./tweets";

const baseUrl = process.env.REACT_APP_BASE_API_URL;
const fantacitorioUrl = baseUrl + "/fantacitorio/";

export const teams = (data) => async (dispatch) => {
    let url = fantacitorioUrl;
    url += `${data.type === "keyword" ? `teamImages` : `teamUser?username=${data.username}`}`;
    url += `${data.maxResults && data.maxResults <= 100 && !data.token ? `&max_results=${data.maxResults}` : ``}`;
    url += `${data.startDate ? `&start_time=${data.startDate}&end_time=${data.endDate}` : ``}`;
    url += `${data.token ? `&pagination_token=${data.token}` : ``}`;
    // Richiesta fetch alla API
    await fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json?.no_matches || json.error)
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
        else{
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

export const scores = (type) => async (dispatch) => {
    const url = fantacitorioUrl + `${type === "ranking" ? "ranking" : "weeklyScores"}`;
    // Richiesta fetch alla API
    await fetch(url)
    .then(res => res.json())
    .then(json => {
        if (json?.no_matches || json.error)
            // Nessun risultato e' stato trovato
            dispatch(noMatches());
        else{
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
