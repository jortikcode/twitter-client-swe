import { DATE_ERROR, TOGGLE_FILTERS } from "../actions/constants";

const initialState = {
    filtersEnabled: false,
    msg: ""
};

export const form = (state = initialState, data) => {
    switch(data.type){
        case TOGGLE_FILTERS:
            return {
                ...state,
                filtersEnabled: data.payload.filtersEnabled
            };
        case DATE_ERROR:
            return {
                ...state,
                dateError: data.payload.msg
            }
        default:
            return state;
    }
}