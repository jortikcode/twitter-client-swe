import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import { useSelector } from 'react-redux'

const ChartsView = () => {
    const { sentiments, creationDates } = useSelector(state => state.tweets);
    return (
        <>
            <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
                {sentiments.length > 0 && (
                    <PieChart sentAnalysis = {sentiments} />
                )}
            </div>
            <div className="pt-4 w-full justify-center flex dark:bg-gray-900 items-center">
                {creationDates.length > 0 && 
                    (<BarChart creationDates = {creationDates} />) }
            </div>  
        </>
    );
};

export default ChartsView;