import Tweet from "./Tweet";
const TweetList = ({ sentiments, textTweets, places, users, types, creationDates }) => {
    return (
        <>
        { ((textTweets.length > 0) && (
            <div className="pt-8 flex gap-y-10 flex-col justify-center items-center md:w-4/6 w-4/5 dark:text-white">
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
                    return (<Tweet
                        sentiment={sentiments ? sentiments[index] : []}
                        placeName={placeName}
                        key={index}
                        name={users[index].name} 
                        username={users[index].username} 
                        pfpUrl={users[index].pfpUrl}
                        type={types[index]}
                        date={`il ${creationDate.toLocaleDateString()} alle ${creationDate.toLocaleTimeString()}`}
                        text={tweet.text} />)})}
            </div> 
        )) }
        </>
    );
}

export default TweetList;