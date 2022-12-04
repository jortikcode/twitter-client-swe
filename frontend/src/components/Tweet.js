import { getPrefix } from "../utils/tweets";
import { NEGATIVE_SENTIMENT,
         POSITIVE_SENTIMENT,
         NEUTRAL_SENTIMENT } from "../utils/constants";   

const Tweet = (props) => {
    const tweetTypeQuote = getPrefix(props.type);
    const sentimentSpan = (
        props.sentiment?.sentiment === NEGATIVE_SENTIMENT ? (<span className="text-red-800 dark:text-red-400"> Male </span>) :
        props.sentiment?.sentiment === POSITIVE_SENTIMENT ? (<span className="text-green-800 dark:text-green-400"> Buono </span> ) :
        props.sentiment?.sentiment === NEUTRAL_SENTIMENT ? (<span className="text-gray-800 dark:text-gray-400"> Neutro </span> ) : ""
    );
    console.log(props)
    return (
        <>
        <div className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:cursor-pointer">
            <img src={props.pfpUrl} className="ml-4 w-10 h-auto rounded-full" alt="profile pic" />
            <div className="flex flex-col justify-between p-4 leading-normal">
                <span className="mb-2 text-2xl font-bold tracking-tight dark:text-sky-400 text-black">{props.name} (@{props.username})</span>
                <span className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{tweetTypeQuote}:</span>
                {props.text && <p className="mb-3 font-normal text-gray-700 dark:text-white">{props.text}</p>}
                <span className="flex items-center font-semibold">
                    {props.sentiment ? sentimentSpan : ""}
                </span>
                <span className="flex items-center font-semibold text-green-800 dark:text-green-200">
                    {props.sentiment?.positiveWords?.length > 0 &&
                     props.sentiment?.positiveWords.map((word, index) => index < (props.sentiment.positiveWords.length - 1) ? `${word}, ` : word)}
                </span>
                <span className="flex items-center font-semibold text-red-800 dark:text-red-400">
                    {props.sentiment?.negativeWords?.length > 0 && 
                     props.sentiment?.negativeWords.map((word, index) => index < (props.sentiment.negativeWords.length - 1) ? `${word}, ` : word)}
                </span>
                {props.fantacitorio && 
                (<div className=""> 
                    <img src={props.teamImageUrl} alt="team pic" /> 
                </div>)}
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