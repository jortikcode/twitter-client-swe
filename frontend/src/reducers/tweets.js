import { 
    CLEAR_TWEETS,
    LOADING,
    NO_MATCHES,
    SEARCH_SUCCESS,
    CLEAR_SCOREBOARD,
    UPDATE_CHAMPIONS,
    CLEAR_STREAM,
    UPDATE_STREAM
} from "../actions/constants";
import { joinSearchSentimentAnalysis, joinWordcloudInfo } from "../utils/stream";

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
    const newTweets = data.payload;
    switch (data.type){
        case UPDATE_STREAM:
            const newWordcloudInfo = joinWordcloudInfo(state.wordcloudInfo, newTweets.wordcloudInfo);
            const newSearchSentiment = joinSearchSentimentAnalysis(state.searchSentiment, newTweets.searchSentiment);
            return ({
                ...state,
                textTweets: [...state.textTweets, ...newTweets.textTweets],
                users: [...state.users, ...newTweets.users],
                creationDates: [...state.creationDates, ...newTweets.creationDates],
                noMatch: false,
                sentiments: [...state.sentiments, ...newTweets.tweetSentiment],
                searchSentiment: newSearchSentiment,
                types: [...state.types, ...newTweets.types],
                places: [...state.places, ...newTweets.places],
                wordcloudInfo: newWordcloudInfo,
                isLoading: false
            })
        case SEARCH_SUCCESS:
            return ({
                ...state,
                textTweets: newTweets.textTweets,
                users: newTweets.users,
                creationDates: newTweets.creationDates,
                noMatch: false,
                sentiments: newTweets.sentiments,
                searchSentiment: newTweets.searchSentiment,
                types: newTweets.types,
                places: newTweets.places,
                wordcloudInfo: newTweets.wordcloudInfo,
                isLoading: false,
                championsString: "",
                nextToken: newTweets.nextToken,
                previousToken: newTweets.previousToken
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
                championsString: newTweets.championsString,
                ghigliottinaDate: newTweets.date
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
        case CLEAR_STREAM:
            return {
                ...initialState
            }
        default:
            return state;
    }
}