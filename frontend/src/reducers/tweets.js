import { 
    CLEAR_TWEETS,
    LOADING,
    NO_MATCHES,
    SEARCH_SUCCESS
} from "../actions/constants";

const initialState = {
    textTweets: [],
    users: [],
    creationDates: [],
    noMatch: false,
    sentiments: [],
    searchSentiment: {},
    types: [],
    places: [],
    wordcloudInfo: [],
    isLoading: false,
    nextToken: "",
    previousToken: ""
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
                searchSentiment: data.payload.searchSentiment,
                types: data.payload.types,
                places: data.payload.places,
                wordcloudInfo: data.payload.wordcloudInfo,
                isLoading: false,
                nextToken: data.payload.nextToken,
                previousToken: data.payload.previousToken
            });
        case NO_MATCHES:
            return ({
                ...state,
                textTweets: [],
                users: {},
                creationDates: [],
                noMatch: true,
                sentiments: [],
                searchSentiment: {},
                types: [],
                places: [],
                wordcloudInfo: [],
                isLoading: false,
                nextToken: "",
                previousToken: ""
            })
        case LOADING:
            return {
                ...state,
                isLoading: true
            }
        case CLEAR_TWEETS:
            return {
                ...initialState
            }
        default:
            return state;
    }
}