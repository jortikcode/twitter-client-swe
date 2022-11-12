import { Link } from 'react-router-dom'
import { Tabs } from 'flowbite-react'

const TabManager = () => {
  return (
    <>
    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
      <li className="mr-2">
        <Link
        to="/search/all"
        className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          Completa
        </Link>
      </li>
      <li className="mr-2">
        <Link
        to="/search/tweets"
        className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          Tweets
        </Link>
      </li>
      <li className="mr-2">
        <Link
        to="/search/map"
        className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          Mappa
        </Link>
      </li>
      <li className="mr-2">
        <Link
        to="/search/charts"
        className="inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          Diagrammi
        </Link>
      </li>
    </ul>
  </>
  );
};

export default TabManager;
