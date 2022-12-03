import { Link } from 'react-router-dom'

const Fantacitorio = () => {
    return (
        <>
            <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900">
                <form className="flex w-full flex-col justify-center items-center gap-4" >
                    <article className="flex justify-center items-center">
                        <p className="text-2xl dark:text-white">Cerca un utente e scopri la sua squadra!</p>
                    </article>

                    <input className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3" name="username" id="username" type="text" placeholder="utente senza @" required
                    //pattern={/^[a-zA-Z0-9_]+$/}
                    />
                    <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit"> Cerca </button>
                </form>

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