import { 
    NO_MATCHES,
    SEARCH_SUCCESS
} from "../actions/constants";

const initialState = {
    textTweets: [],
    users: [],
    creationDates: [],
    noMatch: false,
    sentiments: [],
    types: [],
    places: []
};

export function tweets(state = initialState, data){
    switch (data.type){
        case SEARCH_SUCCESS:
            return ({
                ...state,
                textTweets: data.payload.textTweets,
                users: data.payload.users,
                creationDates: data.payload.creationDates,
                noMatch: false,
                sentiments: data.payload.sentiments,
                types: data.payload.types,
                places: data.payload.places
            });
        case NO_MATCHES:
            return ({
                ...state,
                textTweets: [],
                users: {},
                creationDates: [],
                noMatch: true,
                sentiments: [],
                types: [],
                places: []
            })
        default:
            return state;
    }
}