import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { clearTweets, loadingAction, solutionsAction } from '../actions/tweets';
import LoadingSpinner from '../components/LoadingSpinner';
import Scoreboard from '../components/Scoreboard';
import TweetList from '../components/TweetList';

const Ghigliottina = () => {
    const navigate = useNavigate();
    const [ ghigliottina, setGhigliottina ] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(clearTweets());
    }, [dispatch])
    const { textTweets, isLoading } = useSelector(state => state.tweets);
    const navigationHandler = async (path) => {
        navigate(path);
    }
    return (
        <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900 gap-y-6" >
            <button 
            className="md:text-xl text-lg dark:text-white bg-sky-500 hover:bg-sky-700 text-white py-2 px-4 rounded"
            type="submit"
            onClick={e => navigationHandler("/search/all")}> 
            Scopri cosa dicono su #leredita 
            </button> 
            <button 
            className="md:text-3xl text-lg dark:text-white bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={e => {
                dispatch(loadingAction(true));
                dispatch(solutionsAction());
                setGhigliottina(!ghigliottina);
            }}> 
            { ghigliottina ? "Finisci ghigliottina" : "Avvia ghigliottina" }
            </button>
            <article className="flex justify-center items-center">
                <p className="text-2xl dark:text-white">Cliccando sui tweet scopri chi sono stati i campioni!</p>
            </article>
            <LoadingSpinner isVisible={isLoading} />
            <Scoreboard />
            { (textTweets.length > 0 && ghigliottina) && <TweetList watching={true} /> }
        </div>
    );
};
export default Ghigliottina;