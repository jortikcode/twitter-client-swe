import Tweet from "./Tweet";
import { useDispatch, useSelector } from "react-redux";
import { championsAction, clearScoreboard, loadingAction } from "../actions/tweets";

const TweetList = (props) => {
    const dispatch = useDispatch();
    let { textTweets, places, users, types, creationDates, sentiments } = useSelector(state => state.tweets);
    if (props.textTweets)
        ({ textTweets, places, users, types, creationDates, sentiments } = props);

    const scoreboardHandler = (conversationId, date) => {
        if (props.watching){
            dispatch(loadingAction(true));
            dispatch(clearScoreboard());
            dispatch(championsAction(conversationId, date));
        }
    }

    return (
        <>
        { ((textTweets.length > 0) && (
            <div data-testid="tweetListContainer" className="pt-8 flex gap-y-10 flex-col justify-center items-center md:w-4/6 w-4/5 dark:text-white">
                {textTweets.map((tweet, index) =>
                {
                    let placeName = "";
                    if (places.find(place_info => place_info.index === index))
                        for (const place_info of places){
                            if (place_info.index === index){
                                placeName = place_info.name;
                                break;
                            }
                        }
                    const creationDate = new Date(creationDates[index]);
                    return (<div onClick={e => scoreboardHandler(tweet.conversationId, creationDates[index])} key={index}><Tweet
                        sentiment={sentiments ? sentiments[index] : []}
                        placeName={placeName}
                        name={users[index].name} 
                        username={users[index].username} 
                        pfpUrl={users[index].pfpUrl}
                        type={types[index]}
                        date={`il ${creationDate.toLocaleDateString()} alle ${creationDate.toLocaleTimeString()}`}
                        text={tweet.text} /></div>)})}
            </div> 
        )) }
        </>
    );
}

export default TweetList;