import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { updateScoreboardEntry } from "../actions/fantacitorio";

const FantacitorioScoreboard = () => {
    const { scores, bestSingleScore } = useSelector(state => state.fantacitorio);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        dispatch(updateScoreboardEntry({
            politic: data.name.toUpperCase(),
            points: data.score },
            data.id - 1));
    }

    return (
        <> {(scores.length > 0) && (JSON.stringify(bestSingleScore) !== JSON.stringify({})) &&
            <div className="dark:bg-gray-900 bg-white max-w-full w-[26rem] md:w-[40rem]">
                <section className="flex flex-col w-full justify-center p-6 font-mono">
                <div className="p-4 mb-4 text-sm text-green-700 text-center bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                    <span className="font-medium"> BEST SINGLE SCORE: </span> <span className="font-bold" > { bestSingleScore.politic } </span> { bestSingleScore.points } punti
                </div>
                <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                    <div className="flex flex-col w-full overflow-x-auto items-center">
                        <span className="pt-12 text-center text-3xl dark:text-sky-400 text-black font-bold font-sans pb-7"> Modifica la classifica </span>
                        <span className="pt-12 text-center text-sm dark:text-white text-black font-bold font-sans pb-7"> Per inserire, ID = 0 </span>
                        <form className="flex flex-col justify-center items-center w-fit space-y-7 pb-9 font-sans" onSubmit={handleSubmit(onSubmit)}>
                            <label className='dark:text-white'> ID: <input id="id" className="text-black w-fit" type="number" {
                                ...register("id", {
                                    required: "Fornire un ID"
                                })
                            }/> </label>
                            { errors.id && <p className="text-center dark:text-red-300 text-red-600"> { errors.id.message } </p> }

                            <label className='dark:text-white'> Nome del politico:</label>
                            <input id="name" className="text-black max-w-full h-9" type="text" {
                                ...register("name", {
                                    required: "Fornire un nome"
                                })
                            } /> 
                            { errors.name && <p className="text-center dark:text-red-300 text-red-600"> { errors.name.message } </p> }

                            <label className='dark:text-white'> Punteggio:</label>
                            <input id="politicianScore" type="number" {
                                ...register("score", {
                                    required: "Fornire un punteggio"
                                })
                            }/>
                            { errors.score && <p className="text-center dark:text-red-300 text-red-600"> { errors.score.message } </p> }

                            <button 
                            className="dark:text-white font-bold text-lg bg-sky-400 hover:bg-sky-600 w-fit p-4 rounded-full"
                            type="submit"> Modifica </button>
                        </form>
                        <table className="w-full">
                            <thead>
                                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600 dark:bg-gray-800">
                                    <th className="px-6 py-3 dark:text-sky-500">ID</th>
                                    <th className="px-6 py-3 dark:text-sky-500">Squadra</th>
                                    <th className="px-4 py-3 dark:text-sky-500">Punteggio</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-700">
                                {scores.map((rank, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="px-4 py-3 text-sm border dark:border-gray-900 dark:text-white">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm border dark:border-gray-900 dark:text-white">{rank.politic}</td>
                                            <td className="px-4 py-3 text-sm border dark:border-gray-900 dark:text-white">{rank.points}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                </section>
            </div>}
        </>
    );
}

export default FantacitorioScoreboard;