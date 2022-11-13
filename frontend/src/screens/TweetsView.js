import { useSelector } from 'react-redux'
import TweetList from '../components/TweetList';

const TweetsView = () => {
    const { 
        textTweets, 
        users, 
        creationDates, 
        types, 
        places 
    } = useSelector(state => state.tweets);
    return (
        <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
            {textTweets.length > 0 && (
                <TweetList 
                textTweets={textTweets}
                creationDates={creationDates}
                types={types}
                users={users}
                places={places}
                /> )}
        </div>
    );
};

export default TweetsView;