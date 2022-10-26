import { 
    SEARCH_FAIL,
    SEARCH_SUCCESS
} from "../actions/constants";

const initialState = {
    textTweets: {}
};

export function tweets(state = initialState, data){
    switch (data.type){
        case SEARCH_SUCCESS:
            return ({
                ...state,
                textTweets: data.payload
            });
        case SEARCH_FAIL:
            return ({
                ...state,
                textTweets: {}
            });
        default:
            return state;
    }
}