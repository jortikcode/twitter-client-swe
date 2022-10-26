import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux';
import { keywordSearch } from '../actions/customActions'



const Search = () => {
    const { 
        register, 
        handleSubmit, 
        formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const { textTweets } = useSelector(state => state.tweets);

    const onSubmit = (data) => {
        dispatch(keywordSearch(data.query));
    }

    return (
        <div className="flex w-full p-5 justify-center items-center dark:bg-gray-900">
            <form className="flex w-full flex-col justify-center items-center gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4">
                    <label className="text-3xl dark:text-white" htmlFor="query"> Cosa vorresti cercare? </label>
                    <input className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3" name="query" id="query" type="text" placeholder="Hashtag o keyword" {...register("query", {
                        pattern: {
                            value: /^([#@])?[a-zA-Z0-9]+$/},
                            message: "Testo non valido, la ricerca accetta hashtag, utenti o "
                    })} />
                </div>
                <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit"> Cerca </button>       
                { (textTweets.length > 0) && (textTweets.map(tweet => (<p>{tweet}</p>))) }
            </form>
        </div>
    );
}

export default Search;