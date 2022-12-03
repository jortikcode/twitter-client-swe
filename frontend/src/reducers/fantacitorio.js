import { CLEAR_FANTACITORIO, SCORES_SUCCESS, TEAM_SUCCESS } from "../actions/constants";

const initialState = {
    users: [],
    creationDates: [],
    types: [],
    medias: [],
    scores: [],
    previousToken: "",
    nextToken: "",
    bestSingleScore: {}
}

export const fantacitorio = (state = initialState, data) => {
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
                scores: payload.score,
                bestSingleScore: payload.bestSingleScore
            });
        case CLEAR_FANTACITORIO:
            return ({
                ...initialState
            });
        default:
            return state;
    }
}