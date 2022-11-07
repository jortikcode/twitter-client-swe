import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { searchAction, dateErrorAction } from '../actions/customActions'
import Tweet from './Tweet';
import SearchFilters from './SearchFilters'

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
    // Il dispatch viene utilizzato per riuscire a manipolare lo stato centralizzato di redux
    const dispatch = useDispatch();
    const { textTweets, users, noMatch, creationDates, types } = useSelector(state => state.tweets);
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
            // Se si tratta di una ricerca di un hashtag/utente allora bisogna cambiare la query
            if (hashtagSearchRegex.test(data.query))
                data.query = "%23"+data.query.split('#')[1];
            else if (userSearchRegex.test(data.query))
                data.query = "%40"+data.query.split('@')[1];
            dispatch(dateErrorAction(""));
            // setDateError("");
            // Si attiva l'azione per la ricerca e si aggiorna lo stato centralizzato
            if (data.startDate !== oneWeekAgo || data.endDate !== today){
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
                    query: data.query,
                    startDate: secondsGranularity(data.startDate),
                    endDate: secondsGranularity(data.endDate)
                }));
            }else
                // Non e' stato settato alcun intervallo temporale
                dispatch(searchAction({
                    query: data.query
                }));
        }
        
    }

    return (
        <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900">
            <form className="flex w-full flex-col justify-center items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <label className="text-center text-3xl dark:text-sky-400 text-black" htmlFor="query"> Cosa vorresti cercare? </label>
                    <input className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3" name="query" id="query" type="text" placeholder="#hashtag, keyword" {...register("query", {
                        required: "Testo mancante",
                        pattern: {
                            message: "Testo non valido",
                            value: /^([#@])?[a-zA-Z0-9]+$/}
                    })} />
                    { errors.query && <p className="text-center dark:text-red-300 text-red-600"> { errors.query.message } </p> }
                </div>
                <SearchFilters register={register} errors={errors} />
                <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit"> Cerca </button>       
            </form>
            { ((textTweets.length > 0) && (
                <div className="pt-8 flex gap-y-10 flex-col justify-center md:w-4/6 w-4/5 dark:text-white">
                    {textTweets.map((tweet, index) =>
                    <Tweet 
                    key={index}
                    name={users[index].name} 
                    username={users[index].username} 
                    type={types[index]}
                    date={new Date(creationDates[index]).toDateString()}
                    text={tweet.text} />)}
                </div> 
            )) || 
            ((noMatch) && (
                <p className="pt-5 pb-5 dark:text-yellow-300">Nessun risultato trovato</p>
            ))}
        </div>
    );
}

export default SearchForm;