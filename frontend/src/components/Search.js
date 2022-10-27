import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { keywordSearch } from '../actions/customActions'

function formatISO(date){
    return date.toISOString();
}

const Search = () => {
    const ONE_WEEK_TIMESTAMP = 604800000;
    const now = new Date(Date.now());
    const oneWeekAgo = new Date(now - ONE_WEEK_TIMESTAMP);
    const { 
        register, 
        handleSubmit, 
        formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const { textTweets } = useSelector(state => state.tweets);
    const [ startDateFlag, setStartDateFlag ] = useState(false);
    const [ startDate, setStartDate ] = useState(formatISO(new Date(oneWeekAgo)).split('T')[0]);

    const onSubmit = (data) => {
        console.log({
            query: data.query,
            startDate: formatISO(new Date(data.startDate)),
            endDate: formatISO(new Date(data.endDate))
       });
        dispatch(keywordSearch({
             query: data.query,
             startDate: formatISO(new Date(data.startDate)),
             endDate: formatISO(new Date(data.endDate))
        }));
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
                            min={formatISO(oneWeekAgo).split('T')[0]}
                            max={formatISO(now).split('T')[0]} {...register("startDate", {
                                onChange: event => {
                                    setStartDate(event.target.value);
                                },
                                required: "Data di inizio mancante"
                            })}
                            value={startDate} />
                        { errors.startDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.startDate.message } </p> } 
                        </div>
                        <div className="flex gap-4 items-center">
                            <label className="text-center text-lg dark:text-white" htmlFor="startDateFlag"> A </label>
                            <input className="border border-black rounded dark:border-0 p-3" type="date"
                            min={formatISO(new Date(startDate)).split('T')[0]}
                            max={formatISO(now).split('T')[0]} {...register("endDate")} />
                        { errors.endDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.endDate.message } </p> } 
                        </div>
                    </> 
                          
                )}
                <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit"> Cerca </button>       
                { (textTweets.length > 0) && (textTweets.map(tweet => (<p>{tweet}</p>))) }
            </form>
        </div>
    );
}

export default Search;