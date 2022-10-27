import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { searchAction } from '../actions/customActions'

function formatISO(date){
    return date.toISOString();
}

function formatYYYYMMDD(isoDate){
    return isoDate.split('T')[0];
}

const Search = () => {
    const ONE_WEEK_TIMESTAMP = 604800000;
    let now = new Date(Date.now());
    let oneWeekAgo = formatISO(new Date(now - ONE_WEEK_TIMESTAMP));
    now = formatISO(now);

    const { 
        register, 
        handleSubmit, 
        formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const { textTweets } = useSelector(state => state.tweets);
    const [ startDateFlag, setStartDateFlag ] = useState(false);
    const [ dateError, setDateError ] = useState(false);

    const onSubmit = (data) => {
        data.startDate = data.startDate ? formatISO(new Date(data.startDate)) : oneWeekAgo;
        data.endDate = data.endDate ? formatISO(new Date(data.endDate)) : now;

        // La data di fine deve venire dopo la data di inizio della finestra temporale
        if (data.startDate > data.endDate){
            data.endDate = now;
            setDateError(true);
        }else{      
            setDateError(false);
            dispatch(searchAction({
                query: data.query,
                startDate: data.startDate,
                endDate: data.endDate
            }));
        }
        
    }

    return (
        <div className="flex w-full p-5 justify-center items-center dark:bg-gray-900">
            <form className="flex w-full flex-col justify-center items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <label className="text-center text-3xl dark:text-white" htmlFor="query"> Cosa vorresti cercare? </label>
                    <input className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3" name="query" id="query" type="text" placeholder="Hashtag o keyword" {...register("query", {
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
                                required: startDateFlag ? "Manca la data di fine" : false
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
                { (textTweets.length > 0) && (textTweets.map(tweet => (<p>{tweet}</p>))) }
            </form>
        </div>
    );
}

export default Search;