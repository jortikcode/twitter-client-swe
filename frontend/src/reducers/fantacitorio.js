import { CLEAR_FANTACITORIO, SCORES_SUCCESS, TEAM_SUCCESS, LOADING_FANTACITORIO, UPDATE_SCOREBOARD } from "../actions/constants";

const initialState = {
    users: [],
    creationDates: [],
    types: [],
    medias: [],
    scores: [],
    previousToken: "",
    nextToken: "",
    bestSingleScore: {},
    isLoadingFantacitorio: false
}

const updateScores = (index, score, stateScores) => {
    const newScores = [...stateScores]
    if (index === -1)
        newScores.push(score);
    else
        newScores[index] = score;
    return newScores;
}

export const fantacitorio = (state = initialState, data = {}) => {
    const payload = data.payload;
    switch (data.type){
        case TEAM_SUCCESS:
            return ({
                ...initialState,
                users: payload.users,
                creationDates: payload.creationDates,
                types: payload.types,
                medias: payload.medias,
                previousToken: payload.previousToken,
                nextToken: payload.nextToken
            });
        case SCORES_SUCCESS:
            return ({
                ...initialState,
                scores: payload.data,
                bestSingleScore: payload.bestSingleScore
            });
        case CLEAR_FANTACITORIO:
            return ({
                ...initialState
            });
        case UPDATE_SCOREBOARD:
            console.log(payload)
            const newScores = updateScores(payload.index, payload.score, state.scores);
            return ({
                ...state,
                scores: newScores
            });
        case LOADING_FANTACITORIO:
            return ({
                ...state,
                isLoadingFantacitorio: payload.isLoading
            })
        default:
            return state;
    }
}