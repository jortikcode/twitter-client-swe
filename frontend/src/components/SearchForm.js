import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { searchAction, dateErrorAction, loadingAction, clearTweets } from '../actions/customActions'
import Tweet from './Tweet';
import SearchFilters from './SearchFilters'
import Map from './Map'
import { useState } from 'react';

// Ritorna la data in formato ISO
function formatISO(date){
    return date.toISOString();
}

function secondsGranularity(isoDate){
    const isoSecondsGranularity = `${isoDate.substring(0, isoDate.length - 7)}00.000Z`;
    return isoSecondsGranularity;
}

// Ritorna la data in formato YYYY-MM-DD, l'argomento e' una data in formato ISO 
function formatYYYYMMDD(isoDate){
    return isoDate.split('T')[0];
}

function isValidDateRange(startDateString, endDateString, todayString, oneWeekAgoString){
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const today = new Date(todayString);
    const oneWeekAgo = new Date(oneWeekAgoString);
    let response = {
        msg: "Valid",
        isValid: true
    };
    if (startDate > endDate)
        response = {
            msg: "La data di inizio e' oltre la data di fine dell'intervallo",
            isValid: false
        }
    else if (endDate > today)
        response = {
            msg: "La data di fine e' oltre la data odierna, non e' possibile cercare tweet del futuro!",
            isValid: false
        }   
    else if (startDate < oneWeekAgo)
        response = {
            msg: "La data di inizio dell'intervallo e' oltre una settimana fa, puoi cercare tweet solo all'interno dell'ultima settimana",
            isValid: false
        }
    return response;
}

const SearchForm = () => {
    // Espressioni regolari per la ricerca tramite hashtag (@hashtag) o nome utente (@username)
    const hashtagSearchRegex = new RegExp("^(#)[a-zA-Z0-9]+$");
    const userSearchRegex = new RegExp("^(@)[a-zA-Z0-9]+$");

    // Millisecondi di una settimana: 6 * 24 * 60 * 60 * 1000
    const ONE_WEEK_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;
    // Millisecondi di un giorno: 24 * 60 * 60 * 1000
    const ONE_DAY_MILLISECONDS = 24 * 60 * 60 * 1000;

    // Timestamp di adesso shiftato di error millisecondi indietro
    const error = 60 * 1000;
    const now = new Date(Date.now() - error);
    // Data in formato ISO di oggi
    let today = new Date(formatYYYYMMDD(formatISO(new Date(Date.now()))));
    // Data in formato ISO di una settimana fa
    let oneWeekAgo = formatISO(new Date(today - ONE_WEEK_MILLISECONDS));
    today = formatISO(today);

    // Oggetti utile per la manipolazione del form con lo hook useForm
    const { 
        register, 
        handleSubmit, 
        formState: { errors } } = useForm();
    // Stato per tenere traccia del tipo della ricerca: per utente o per parola chiave
    const [ type, setType ] = useState("username");
    // Il dispatch viene utilizzato per riuscire a manipolare lo stato centralizzato di redux
    const dispatch = useDispatch();
    const { textTweets, users, noMatch, creationDates, types, places, sentiments, isLoading, nextToken, previousToken } = useSelector(state => state.tweets);
    const { filtersEnabled } = useSelector(state => state.form);

    // Funzione di submit del form
    const onSubmit = (data) => {
        // Se le date sono state settate, allora bisogna prenderne il formato ISO
        data.startDate = data.startDate && filtersEnabled ? formatISO(new Date(data.startDate)) : oneWeekAgo;
        data.endDate = data.endDate && filtersEnabled ? formatISO(new Date(data.endDate)) : today;


        /* Check sull'intervallo delle date, deve valere:
        1. startDate < endDate
        2. endDate > oneWeekago
        3. startDate < today */
        const { isValid, msg } = isValidDateRange(data.startDate, data.endDate, today, oneWeekAgo);
        if (! isValid){
            dispatch(dateErrorAction(msg))
        }else{
            dispatch(clearTweets());
            // Spinner di caricamento visibile
            dispatch(loadingAction(true));
            // Se si tratta di una ricerca di un hashtag/utente allora bisogna cambiare la query
            if (hashtagSearchRegex.test(data.query))
                data.query = "%23"+data.query.split('#')[1];
            else if (userSearchRegex.test(data.query))
                data.query = "%40"+data.query.split('@')[1];
            dispatch(dateErrorAction(""));
            // Si attiva l'azione per la ricerca e si aggiorna lo stato centralizzato
            if ((data.startDate !== oneWeekAgo || data.endDate !== today || data.username) && filtersEnabled){
                // Se la data di inizio e la data di fine coincidono, la data di fine deve essere "shiftata" di 24 ore in avanti
                if (data.endDate === data.startDate){
                    let shiftedEndDate = Date.parse(data.endDate);
                    shiftedEndDate = new Date(shiftedEndDate + ONE_DAY_MILLISECONDS);
                    // Bisogna evitare che la data shiftata vada oltre il giorno odierno 
                    shiftedEndDate = shiftedEndDate.getTime() > now ? new Date(now) : shiftedEndDate;
                    data.endDate = formatISO(shiftedEndDate);
                }
                // E' stato settato un intervallo temporale dall'utente
                dispatch(searchAction({
                    type,
                    query: data.query,
                    username: data.username,
                    startDate: secondsGranularity(data.startDate),
                    endDate: secondsGranularity(data.endDate)
                }));                
            }else
                // Non e' stato settato alcun intervallo temporale
                dispatch(searchAction({
                    type,
                    query: data.query,
                    username: data.username
                }));
        }
        
    }

    return (
    <>
        <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900">
            <form className="flex w-full flex-col justify-center items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <label className="text-center text-3xl dark:text-sky-400 text-black" htmlFor="query"> Cosa vorresti cercare? </label>
                    <div className="flex md:flex-row flex-col justify-center items-center">
                        <label className="text-center dark:text-white" htmlFor="type">
                            Scegli il tipo di ricerca:
                        </label>
                        <select className="ml-3" value={type} onChange={(e) => {
                            setType(e.target.value);
                        }}>
                            <option className="dark:text-white" value="username">Per utente</option>
                            <option className="dark:text-white" value="keyword">Per parola chiave</option>
                        </select>
                    </div>
                    {type === "keyword" ? (
                    <input className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3" name="query" id="query" type="text" placeholder="#hashtag, keyword" {...register("query", {
                        required: "Testo mancante",
                        pattern: {
                            message: "Keyword non valido",
                            value: /^([#@])?[a-zA-Z0-9_]+$/}
                    })} />) : 
                    (<input className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3" name="username" id="username" type="text" placeholder="username without @" {...register("username", {
                        required: "Testo mancante",
                        pattern: {
                            message: "Username non valido",
                            value: /^([#@])?[a-zA-Z0-9_]+$/}
                    })} />)}
                    { errors.query && <p className="text-center dark:text-red-300 text-red-600"> { errors.query.message } </p> }
                    { errors.username && <p className="text-center dark:text-red-300 text-red-600"> { errors.username.message } </p> }

                </div>
                <SearchFilters register={register} errors={errors} />
                <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit"> Cerca </button>       
            </form>

            { (isLoading)  && (     
            <div className="pt-5" role="status">
                <svg className="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            )}

            { ((textTweets.length > 0) && (
                <div className="pt-8 flex gap-y-10 flex-col justify-center items-center md:w-4/6 w-4/5 dark:text-white">
                    {textTweets.map((tweet, index) =>
                    {
                        let placeName = "";
                        if (places.find(place_info => place_info.index === index))
                            for (const place_info of places){
                                if (place_info.index === index){
                                    placeName = place_info.name;
                                    break;
                                }
                            }
                        return (<Tweet
                            placeName={placeName}
                            key={index}
                            name={users[index].name} 
                            username={users[index].username} 
                            pfpUrl={users[index].pfpUrl}
                            type={types[index]}
                            date={new Date(creationDates[index]).toDateString()}
                            text={tweet.text} />)})}
                </div> 
            )) || 
            ((noMatch) && (
                <p className="pt-5 pb-5 dark:text-yellow-300">Nessun risultato trovato</p>
            ))}
        </div>
        <div className="w-full md:p-8 p-3 dark:bg-gray-900">
        {places.length > 0 && (
                <Map 
                textTweets = {textTweets} 
                users = {users}
                types = {types}
                dates = {creationDates}
                tweetPlaces = {places} />
            )}
        </div>
    </>
    );
}

export default SearchForm;