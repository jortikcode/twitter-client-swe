import { DATE_ERROR, TOGGLE_INTERVAL } from "../actions/constants";

const initialState = {
    isIntervalEnabled: false,
    msg: ""
};

export const form = (state = initialState, data) => {
    switch(data.type){
        case TOGGLE_INTERVAL:
            return {
                ...state,
                isIntervalEnabled: data.payload.isIntervalEnabled
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