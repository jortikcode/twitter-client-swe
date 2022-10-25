import React from 'react'
import { useSelector } from 'react-redux'

function ContenutoHomepage () {
    const { darkMode } = useSelector(state => state.theme);
    // Se e' attiva la darkMode, il bordo del testo e' bianco, altrimenti e' nero
    const borderText = {
        'textShadow': darkMode ? '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' : '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white'   
    }

    return (
        <>
            <div className="w-100 flex justify-center items-center p-5 dark:bg-gray-900">
                <div className="md:w-3/4 w-11/12">
                    <h1 className="text-6xl md:text-7xl text-center tracking-wide dark:text-white text-sky-500 pb-32" style={borderText}>Twitta come i pro! </h1>
                    <div className="w-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <article className="flex order-1 justify-center items-center">
                            <p className="text-3xl dark:text-white">Usa anche tu questo client di twitter, sta spopolando!</p>
                        </article>
                        <img className="order-2" alt="immagine illustrativa" src={`/images/${darkMode ? "join-dark.svg" : "join.svg"}`} />
                        <img className="order-4 md:order-3" alt="immagine illustrativa" src={`/images/${darkMode ? "search-dark.svg" : "search.svg"}`} />
                        <article className="md:order-4 order-3 flex justify-center items-center">
                            <p className="text-3xl dark:text-white">Puoi effettuare ricerche di tweet e filtrarli come vuoi tu!</p>
                        </article>
                        <article className="order-5 flex justify-center items-center">
                            <p className="text-3xl dark:text-white">Una volta effettuata la ricerca puoi visualizzare i risultati tantissimi modi diversi!</p>
                        </article>
                        <img className="order-6" alt="immagine illustrativa" src={`/images/${darkMode ? "visualize-dark.svg" : "visualize.svg"}`} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContenutoHomepage
