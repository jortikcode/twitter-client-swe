import { useSelector } from 'react-redux'
import TweetList from '../components/TweetList';

const TweetsView = () => {
    const { textTweets } = useSelector(state => state.tweets);
    return (
        <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
            {textTweets.length > 0 && (
                <TweetList /> )}
        </div>
    );
};

export default TweetsView;