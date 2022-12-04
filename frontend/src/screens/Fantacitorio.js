import { useDispatch, useSelector } from 'react-redux';
import { loadingFantacitorio, scores } from '../actions/fantacitorio';
import SearchForm from '../components/SearchForm'
import LoadingSpinner from '../components/LoadingSpinner';
import { useEffect, useState } from 'react';

const WEEKLY_SCORES = "weeklyScores";
const ALL_SCORES = "ranking"

const Fantacitorio = () => {
    const dispatch = useDispatch();
    const [ type, setType ] = useState("");
    const { isLoadingFantacitorio } = useSelector(state => state.fantacitorio);
    useEffect(() => {
        switch(type){
            case WEEKLY_SCORES:
                dispatch(loadingFantacitorio(true));
                dispatch(scores(type));
                break;
            case ALL_SCORES:
                dispatch(loadingFantacitorio(true));
                dispatch(scores(type));
                break;
            default:
                break;
        }
    }, [type, dispatch]);

    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900">
                <SearchForm fantacitorio={true} />
                <LoadingSpinner isVisible={isLoadingFantacitorio} />
                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li className="mr-2">
                        <button
                            className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                            onClick={e => setType(WEEKLY_SCORES)}
                        >
                            Classifica della settimana
                        </button>
                    </li>
                    <li className="mr-2">
                        <button
                            className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                            onClick={e => setType(ALL_SCORES)}
                        >
                            Classifica di sempre
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
};
export default Fantacitorio;