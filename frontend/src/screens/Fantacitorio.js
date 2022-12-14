import { Link, Outlet } from "react-router-dom";

const Fantacitorio = () => {
    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900">
                <ul className="flex flex-row w-full justify-center gap-x-7 dark:text-yellow-300 font-bold text-amber-800">
                    <li className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"> <Link to='/fantacitorio/scores'> Classifiche </Link> </li>
                    <li className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"> <Link to='/fantacitorio/teams'> Squadre </Link> </li>
                </ul>
                <Outlet />
            </div>
        </>
    );
}

export default Fantacitorio;