import Tweet from "./Tweet";
import { useSelector } from "react-redux";

const TweetList = () => {
    const { textTweets, places, users, types, creationDates } = useSelector(state => state.tweets);
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
                    return (<Tweet
                        placeName={placeName}
                        key={index}
                        name={users[index].name} 
                        username={users[index].username} 
                        pfpUrl={users[index].pfpUrl}
                        type={types[index]}
                        date={new Date(creationDates[index]).toDateString()}
                        text={tweet.text} />)})}
            </div> 
        )) }
        </>
    );
}

export default TweetList;