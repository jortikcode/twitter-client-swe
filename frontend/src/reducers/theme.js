import { TOGGLE_COLOR_MODE } from '../actions/constants'

const initialState = {
    darkMode: true
};

export const theme = (state = initialState, data) => {
    switch(data.type){
        case TOGGLE_COLOR_MODE:
            return {
                ...state,
                darkMode: !data.payload.darkMode
            }
        default:
            return state
    }
}