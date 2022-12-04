import { useSelector } from 'react-redux'

const FantacitorioScoreboard = () => {
    const { scores, bestSingleScore } = useSelector(state => state.fantacitorio);
    return (
        <> {(scores.length > 0) && (JSON.stringify(bestSingleScore) !== JSON.stringify({})) &&
            <div className="dark:bg-gray-900 bg-white max-w-full w-[26rem] md:w-[40rem]">
                <section className="container mx-auto p-6 font-mono">
                <div class="p-4 mb-4 text-sm text-green-700 text-center bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                    <span class="font-medium"> BEST SINGLE SCORE: </span> <span className="font-bold" > { bestSingleScore.politic } </span> { bestSingleScore.points } punti
                </div>
                <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600 dark:bg-gray-800">
                                    <th className="px-6 py-3 dark:text-sky-500">Squadra</th>
                                    <th className="px-4 py-3 dark:text-sky-500">Punteggio</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-700">
                                {scores.map((rank, key) => {
                                    return (
                                        <tr key={key}>
                                            <td className="px-4 py-3 text-sm border dark:border-gray-900 dark:text-white">{rank.politic}</td>
                                            <td className="px-4 py-3 text-sm border dark:border-gray-900 dark:text-white">{rank.points}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        { bestSingleScore.politic }   </div>
                </div>

                </section>
            </div>}
        </>
    );
}

export default FantacitorioScoreboard;