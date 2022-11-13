import Map from "../components/Map";
import { useSelector } from 'react-redux'

const MapView = () => {
    const { 
        textTweets, 
        users, 
        creationDates, 
        types, 
        places 
    } = useSelector(state => state.tweets);
    return (
        <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
            <div className="w-full md:p-8 p-3 dark:bg-gray-900">
            <Map 
                textTweets = {textTweets} 
                users = {users}
                types = {types}
                dates = {creationDates}
                tweetPlaces = {places} />
            </div>
        </div>
    );
};

export default MapView;