import { Link } from 'react-router-dom'
import SearchForm from '../components/SearchForm'

const Fantacitorio = () => {
    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900">
                <SearchForm fantacitorio={true} />

                <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
                    <li className="mr-2">
                        <Link
                            to="/squadre"
                            className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        >
                            Squadre dell'ultima settimana
                        </Link>
                    </li>
                    <li className="mr-2">
                        <Link
                            to="/classifica"
                            className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        >
                            Classifica dei politici
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
};
export default Fantacitorio;