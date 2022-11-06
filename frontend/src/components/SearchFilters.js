import { useDispatch, useSelector } from "react-redux";
import { intervalSearchAction } from "../actions/customActions";


const SearchFilters = ({ register, errors }) => {
    const { isIntervalEnabled, dateError } = useSelector(state => state.form);
    const dispatch = useDispatch();

    return (
    <>
        <div className="flex gap-4">
            <input type="checkbox" id="intervalSearch" name="intervalSearch" value={isIntervalEnabled} onChange={
                event => {
                    dispatch(intervalSearchAction(event.target.checked));
                }
            } />
            <label className="text-center text-lg dark:text-white" htmlFor="intervalSearch"> Invervallo di tempo </label>
        </div>
        {isIntervalEnabled && (
            <>
                <div className="flex gap-4 items-center">
                    <label className="text-center text-lg dark:text-white" htmlFor="dataInizio"> Da </label>
                    <input name="dataInizio" id="dataInizio" className="border border-black rounded dark:border-0 p-3" type="date"
                    {...register("startDate", {
                        required: isIntervalEnabled ? "Manca la data di inizio" : false
                    })} />
                { errors.startDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.startDate.message } </p> } 
                </div>
                <div className="flex gap-4 items-center">
                    <label className="text-center text-lg dark:text-white" htmlFor="dataFine"> A </label>
                    <input name="dataFine" id="dataFine" className="border border-black rounded dark:border-0 p-3" type="date"
                    {...register("endDate", {
                        required: isIntervalEnabled ? "Manca la data di fine" : true
                    })} />
                    { (errors.endDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.endDate.message } </p>) } 
                </div>
                
                { (dateError && <p className="text-center dark:text-red-300 text-red-600"> {dateError} </p>) }
            </>)}
    </>
    )
};

export default SearchFilters;