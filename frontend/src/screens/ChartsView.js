import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import Wordcloud from "../components/Wordcloud";
import { useSelector } from 'react-redux'

const ChartsView = () => {
    const { sentiments, creationDates, searchSentiment, wordcloudInfo } = useSelector(state => state.tweets);
    return (
        <>
            <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
                {sentiments.length > 0 && (
                    <PieChart title="Analisi dei tweet" sentAnalysis = {sentiments} />
                )}
            </div>
            <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
                {sentiments.length > 0 && (
                    <PieChart title="Analisi delle parole dei risultati" sentiments = {[searchSentiment.negatives, searchSentiment.positives, searchSentiment.neutrals]} />
                )}
            </div>
            <div className="pt-4 w-full justify-center flex dark:bg-gray-900 items-center">
                {creationDates.length > 0 && 
                    (<BarChart title="Tweet nel tempo" creationDates = {creationDates} />) }
            </div>
            <div className="pt-4 w-full justify-center flex dark:bg-gray-900 items-center">
                {wordcloudInfo.length > 0 && 
                    (<Wordcloud title="Wordcloud della ricerca" />) }
            </div> 

        </>
    );
};

export default ChartsView;