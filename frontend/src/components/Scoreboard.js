import { useState } from "react";
import { useSelector } from "react-redux";

const Scoreboard = () => {
    const { championsString, ghigliottinaDate } = useSelector(state => state.tweets);
    const [ showScoreboard, setShowScoreboard ] = useState(false);
    const date = new Date(ghigliottinaDate);
    return (
        <>
            {championsString.length > 0 &&
            <button className="bg-green-400 dark:bg-green-900 text-white p-4 rounded-full font-bold"
                    type="button"
                    onClick={e => setShowScoreboard(!showScoreboard)}>
                {showScoreboard ? "Chiudi" : "Apri"} classifica
            </button> }
            {showScoreboard && championsString.length > 0 &&
                <span className="p-8 text-center dark:text-white border-8 dark:border-gray-400 border-black rounded-2xl">
                    <span className="flex justify-center text-blue-600 dark:text-gray-400 font-semibold">
                    {`il ${date.toLocaleDateString()} alle ${date.toLocaleTimeString()}`}
                    </span>
                    <pre>
                        {championsString}
                    </pre>
                </span>
            }
            
        </>
    );
}

export default Scoreboard;