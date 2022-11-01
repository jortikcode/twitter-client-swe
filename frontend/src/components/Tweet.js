import { RETWEET,
        REPLY,
        TWEET,
        QUOTED,
        NOTYPE  } from "../utils/constants";

const Tweet = (props) => {
    let tweetTypeQuote;
    switch(props.type){
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
    return (
        <div>
            <p>
                <span className="text-blue-700 dark:text-green-400"> 
                    {props.name} ({props.username})
                </span> il 
                <span className="text-blue-700 dark:text-green-400"> 
                    {props.date} 
                </span> {tweetTypeQuote} : {props.text}
            </p>
        </div>
    )
}

export default Tweet;