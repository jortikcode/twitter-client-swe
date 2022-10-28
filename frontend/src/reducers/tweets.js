import { 
    NO_MATCHES,
    SEARCH_FAIL,
    SEARCH_SUCCESS
} from "../actions/constants";

const initialState = {
    textTweets: [],
    users: [],
    creationDates: [],
    noMatch: false
};

export function tweets(state = initialState, data){
    switch (data.type){
        case SEARCH_SUCCESS:
            return ({
                ...state,
                textTweets: data.payload.textTweets,
                users: data.payload.users,
                creationDates: data.payload.creationDates,
                noMatch: false
            });
        case SEARCH_FAIL:
            return ({
                ...state,
                textTweets: [],
                users: {},
                creationDates: [],
                noMatch: false
            });
        case NO_MATCHES:
            return ({
                ...state,
                textTweets: [],
                users: {},
                creationDates: [],
                noMatch: true
            })
        default:
            return state;
    }
}