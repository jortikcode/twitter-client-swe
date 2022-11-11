import { loadingAction, clearTweets, searchAction } from "../actions/customActions";
import { useDispatch } from 'react-redux'


const PageManager = ({nextToken, previousToken, data}) => {
    const dispatch = useDispatch();
    const newPage = (token) => {
        dispatch(clearTweets());
        dispatch(loadingAction());
        dispatch(searchAction({...data, token: token}));
    }

    return (      
    <div className="flex justify-center dark:bg-gray-900">
        {previousToken &&
        <button 
        onClick={e => newPage(previousToken)}
        type="button" 
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
            Pagina precedente
        </button>}
        {nextToken &&
        <button
        onClick={e => newPage(nextToken)} 
        type="button"
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
            Pagina successiva
        </button>}
    </div>);
}

export default PageManager;