import { getPrefix } from "../utils/tweets";

const Tweet = (props) => {
    const tweetTypeQuote = getPrefix(props.type);
    return (
        <>
        <div className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:cursor-pointer">
            <img src={props.pfpUrl} className="ml-4 w-10 h-auto rounded-full" alt="profile pic" />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <span className="mb-2 text-2xl font-bold tracking-tight dark:text-sky-400 text-black">{props.name} (@{props.username})</span>
                <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{tweetTypeQuote}:</span>
                <p className="mb-3 font-normal text-gray-700 dark:text-white">{props.text}</p>
                <span className="flex items-center text-blue-600 dark:text-gray-400 font-semibold">
                    {props.date}
                </span>
                {props.placeName && (
                <>
                    <span className="flex items-center text-blue-400 dark:text-gray-500 font-semibold">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z">
                        </path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z">
                        </path>
                    </svg> 
                    {props.placeName}
                    </span>
                </>
                )}
            </div>
            
        </div>
        </>
    )
}

export default Tweet;