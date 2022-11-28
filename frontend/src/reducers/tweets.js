import { 
    CLEAR_TWEETS,
    LOADING,
    NO_MATCHES,
    SEARCH_SUCCESS,
    CLEAR_SCOREBOARD,
    UPDATE_CHAMPIONS
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
    championsString: "",
    isLoading: false,
    nextToken: "",
    previousToken: "",
    ghigliottinaDate: ""
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
                championsString: "",
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
                championsString: "",
                nextToken: "",
                previousToken: "",
                ghigliottinaDate: ""
            })
        case UPDATE_CHAMPIONS:
            return ({
                ...state,
                isLoading: false,
                championsString: data.payload.championsString,
                ghigliottinaDate: data.payload.date
            })
        case CLEAR_SCOREBOARD:
            return ({
                ...state,
                championsString: "",
                ghigliottinaDate: ""
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