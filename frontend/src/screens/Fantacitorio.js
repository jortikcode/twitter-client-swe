import { Link, Outlet } from "react-router-dom";

const Fantacitorio = () => {
    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900">
                <ul className="flex flex-row w-full justify-center gap-x-7 dark:text-yellow-300 font-bold text-amber-800">
                    <li className="active:text-yellow-500 rounded-lg border-gray-400 border-4 p-4"> <Link to='/fantacitorio/scores'> Classifiche </Link> </li>
                    <li className="active:text-yellow-500 rounded-lg border-gray-400 border-4 p-4"> <Link to='/fantacitorio/teams'> Squadre </Link> </li>
                </ul>
                <Outlet />
            </div>
        </>
    );
}

export default Fantacitorio;