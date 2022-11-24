import TweetList from "../components/TweetList";
import Map from "../components/Map";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import { useSelector } from 'react-redux'
import Wordcloud from "../components/Wordcloud";

const AllViews = () => {
    const { 
        textTweets, 
        users, 
        creationDates, 
        types, 
        places, 
        sentiments,
        searchSentiment } = useSelector(state => state.tweets);
    return (
        <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
            {textTweets.length > 0 && (
            <>
                <TweetList 
                textTweets={textTweets}
                creationDates={creationDates}
                types={types}
                users={users}
                places={places}
                /> 
                <PieChart title="Analisi dei tweet" sentAnalysis = {sentiments} />
                <PieChart title="Analisi delle parole dei risultati" sentiments = {[searchSentiment.negatives, searchSentiment.positives, searchSentiment.neutrals]} />
                <BarChart title="Tweet nel tempo" creationDates = {creationDates} />
                <Wordcloud title="Wordcloud della ricerca" />
                { places.length > 0 &&
                (
                <div className="w-full md:p-8 p-3 dark:bg-gray-900">
                <Map 
                    textTweets = {textTweets} 
                    users = {users}
                    types = {types}
                    dates = {creationDates}
                    tweetPlaces = {places} />
                </div>)
                }
                
            </>)}
        </div>
    );
};

export default AllViews;