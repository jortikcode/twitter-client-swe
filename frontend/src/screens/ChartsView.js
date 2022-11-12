import PieChart from "../components/PieChart";
import { useSelector } from 'react-redux'

const ChartsView = () => {
    const { sentiments } = useSelector(state => state.tweets);
    return (
        <div className="flex w-full flex-col dark:bg-gray-900 items-center gap-y-8">
            {sentiments.length > 0 && (
                <PieChart sentAnalysis = {sentiments} />
            )}
        </div>
    );
};

export default ChartsView;