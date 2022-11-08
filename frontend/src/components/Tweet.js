import { getPrefix } from "../utils/tweets";

const Tweet = (props) => {
    const tweetTypeQuote = getPrefix(props.type);
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