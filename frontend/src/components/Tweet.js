import { getPrefix } from "../utils/tweets";

const Tweet = (props) => {
    const tweetTypeQuote = getPrefix(props.type);
    return (
        <>
        <div class="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 hover:cursor-pointer">
            <img src={props.pfpUrl} class="ml-4 w-10 h-auto rounded-full" alt="profile pic" />
            <div class="flex flex-col justify-between p-4 leading-normal">
                <span class="mb-2 text-2xl font-bold tracking-tight dark:text-sky-400 text-white">{props.name} (@{props.username})</span>
                <span class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{tweetTypeQuote}:</span>
                <p class="mb-3 font-normal text-gray-700 dark:text-white">{props.text}</p>
                <span class="flex items-center text-blue-600 dark:text-gray-400 font-semibold">
                    {props.date}
                </span>
            </div>
            
        </div>
        </>
    )
}

export default Tweet;