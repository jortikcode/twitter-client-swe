import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { searchAction } from '../actions/customActions'

// Ritorna la data in formato ISO
function formatISO(date){
    return date.toISOString();
}

// Ritorna la data in formato YYYY-MM-DD, l'argomento e' una data in formato ISO 
function formatYYYYMMDD(isoDate){
    return isoDate.split('T')[0];
}

const Search = () => {
    // Espressioni regolari per la ricerca tramite hashtag (@hashtag) o nome utente (@username)
    const hashtagSearchRegex = new RegExp("^(#)[a-zA-Z0-9]+$");
    const userSearchRegex = new RegExp("^(@)[a-zA-Z0-9]+$");

    // Timestamp di una settimana: 6 * 24 * 60 * 60 * 1000
    const ONE_WEEK_TIMESTAMP = 6 * 24 * 60 * 60 * 1000;
    // Timestamp di adesso
    let now = new Date(formatYYYYMMDD(formatISO(new Date(Date.now()))));
    // Timestamp di una settimana fa
    let oneWeekAgo = formatISO(new Date(now - ONE_WEEK_TIMESTAMP));
    now = formatISO(now);

    // Oggetti utile per la manipolazione del form con lo hook useForm
    const { 
        register, 
        handleSubmit, 
        formState: { errors } } = useForm();
    // Il dispatch viene utilizzato per riuscire a manipolare lo stato centralizzato di redux
    const dispatch = useDispatch();
    const { textTweets, users, noMatch, creationDates } = useSelector(state => state.tweets);
    const [ startDateFlag, setStartDateFlag ] = useState(false);
    const [ dateError, setDateError ] = useState(false);

    // Funzione di submit del form
    const onSubmit = (data) => {
        // Se le date sono state settate, allora bisogna prenderne il formato ISO
        data.startDate = data.startDate ? formatISO(new Date(data.startDate)) : oneWeekAgo;
        data.endDate = data.endDate ? formatISO(new Date(data.endDate)) : now;

        // La data di fine deve venire dopo la data di inizio della finestra temporale
        if (data.startDate > data.endDate){
            data.endDate = now;
            setDateError(true);
        }else{
            // Se si tratta di una ricerca di un hashtag/utente allora bisogna cambiare la query
            if (hashtagSearchRegex.test(data.query))
                data.query = "%23"+data.query.split('#')[1];
            else if (userSearchRegex.test(data.query))
                data.query = "%40"+data.query.split('@')[1];
            setDateError(false);
            // Si attiva l'azione per la ricerca e si aggiorna lo stato centralizzato
            dispatch(searchAction({
                query: data.query,
                startDate: data.startDate,
                endDate: data.endDate
            }));
        }
        
    }

    return (
        <div className="flex flex-col w-full p-5 justify-center items-center dark:bg-gray-900">
            <form className="flex w-full flex-col justify-center items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <label className="text-center text-3xl dark:text-sky-400 text-black" htmlFor="query"> Cosa vorresti cercare? </label>
                    <input className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3" name="query" id="query" type="text" placeholder="#hashtag, @utente, keyword" {...register("query", {
                        required: "Testo mancante",
                        pattern: {
                            message: "Testo non valido",
                            value: /^([#@])?[a-zA-Z0-9]+$/}
                    })} />
                    { errors.query && <p className="text-center dark:text-red-300 text-red-600"> { errors.query.message } </p> }
                </div>
                <div className="flex gap-4">
                    <input type="checkbox" id="startDateFlag" name="startDateFlag" value={startDateFlag} onChange={
                        event => {
                            setStartDateFlag(event.target.checked);
                        }
                    } />
                    <label className="text-center text-lg dark:text-white" htmlFor="startDateFlag"> Invervallo di tempo </label>
                </div>
                {startDateFlag && (
                    <>
                        <div className="flex gap-4 items-center">
                            <label className="text-center text-lg dark:text-white" htmlFor="startDateFlag"> Da </label>
                            <input className="border border-black rounded dark:border-0 p-3" type="date"
                            min={formatYYYYMMDD(oneWeekAgo)}
                            max={formatYYYYMMDD(now)} {...register("startDate", {
                                required: startDateFlag ? "Manca la data di inizio" : false
                            })} />
                        { errors.startDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.startDate.message } </p> } 
                        </div>
                        <div className="flex gap-4 items-center">
                            <label className="text-center text-lg dark:text-white" htmlFor="startDateFlag"> A </label>
                            <input className="border border-black rounded dark:border-0 p-3" type="date"
                            min={formatYYYYMMDD(oneWeekAgo)}
                            max={formatYYYYMMDD(now)} {...register("endDate", {
                                required: startDateFlag ? "Manca la data di fine" : true
                            })} />
                        { (errors.endDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.endDate.message } </p>)
                        || (dateError && <p className="text-center dark:text-red-300 text-red-600"> Errore, prova a cercare con un'altra data di fine</p>) } 
                        </div>
                    </>)}
                <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit"> Cerca </button>       
            </form>
            { ((textTweets.length > 0) && (
                <div className="pt-8 flex gap-y-10 flex-col justify-center md:w-4/6 w-4/5 dark:text-white"> 
                    {textTweets.map((tweet, index) => (<p key={index}> 
                    (<span className="text-blue-700 dark:text-green-400"> {users[index].name} (@{users[index].username}) </span>) 
                    Ha scritto il 
                    (<span className="text-blue-700 dark:text-green-400"> {creationDates[index].toDateString()} </span>): {tweet}</p>))}
                </div>)) || 
                ((noMatch) && (
                    <p className="pt-5 pb-5 dark:text-yellow-300">Nessun risultato trovato</p>
                ))}
        </div>
    );
}

export default Search;