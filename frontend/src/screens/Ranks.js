import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import { loadingFantacitorio, scores } from '../actions/fantacitorio'
import { useRef } from 'react';
import FantacitorioScoreboard from '../components/FantacitorioScoreboard';

const WEEKLY_SCORES = "weeklyPoints";
const ALL_SCORES = "ranking"

const Ranks = () => {
    const type = useRef(WEEKLY_SCORES);
    const dispatch = useDispatch();
    const { isLoadingFantacitorio } = useSelector(state => state.fantacitorio);
    return (
        <>
        <form className="flex flex-col gap-y-6" >
            <label className="pt-12 text-center text-3xl dark:text-sky-400 text-black" htmlFor="classifica"> Seleziona quale classifica visualizzare </label>
            <select ref={type}>
                <option value={WEEKLY_SCORES}> Classifica delle settimana </option>
                <option value={ALL_SCORES}> Classifica di sempre </option>
            </select>
            <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                    type="button"
                    onClick={e => {
                        console.log(type.current.value)
                        dispatch(loadingFantacitorio(true));
                        dispatch(scores(type.current.value));
                        }}> Cerca </button>       
        </form>
        <LoadingSpinner isVisible={isLoadingFantacitorio} />
        <FantacitorioScoreboard />
        </>
    );
}

export default Ranks;