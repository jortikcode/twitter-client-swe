import { loadingAction, clearTweets, searchAction } from "../actions/tweets";
import { useDispatch, useSelector } from 'react-redux'
import { clearFantacitorio, loadingFantacitorio, teams } from "../actions/fantacitorio";


const PageManager = ({data, fantacitorio}) => {
    const dispatch = useDispatch();
    const { previousToken, nextToken } = useSelector(state => fantacitorio ? state.fantacitorio : state.tweets);
    const newPage = (token) => {
        if (fantacitorio){
            dispatch(clearFantacitorio());
            dispatch(loadingFantacitorio(true));
        }else{
            dispatch(clearTweets());
            dispatch(loadingAction(true));
        }
        if (fantacitorio)
            dispatch(teams({...data, token: token}))
        else
            dispatch(searchAction({...data, token: token}));
    }

    return (      
    <div className="flex justify-center dark:bg-gray-900">
        {previousToken &&
        <button 
        onClick={e => newPage(previousToken)}
        type="button" 
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
        <svg className="w-6 h-6 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18">
            </path>
        </svg>
        </button>}
        {nextToken &&
        <button
        onClick={e => newPage(nextToken)} 
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
        <svg className="w-6 h-6 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3">
            </path>
        </svg>
        </button>}
    </div>);
}

export default PageManager;