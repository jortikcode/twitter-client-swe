import { RETWEET,
    REPLY,
    TWEET,
    QUOTED,
    NOTYPE  } from "../utils/constants";
    
export const getPrefix = (type) => {
    let tweetTypeQuote = "";
    switch(type){
        case REPLY:
            tweetTypeQuote = "Ha risposto";
            break;
        case RETWEET:
            tweetTypeQuote = "Ha retwittato";
            break;
        case TWEET:
            tweetTypeQuote = "Ha twittato";
            break;
        case QUOTED:
            tweetTypeQuote = "Ha citato";
            break;
        default:
            tweetTypeQuote = NOTYPE;
    }
    return tweetTypeQuote;
}