import { useDispatch, useSelector } from "react-redux";
import { filtersAction } from "../actions/customActions";


const SearchFilters = ({ register, errors }) => {
    const { filtersEnabled, dateError } = useSelector(state => state.form);
    const dispatch = useDispatch();

    return (
    <>

        <label htmlFor="filtersEnabled" className="inline-flex relative items-center mb-5 cursor-pointer">
            <input type="checkbox" value="" id="filtersEnabled" className="sr-only peer" onChange={
                event => {
                    dispatch(filtersAction(event.target.checked));
                }
            } />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>            
            <span className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Filtri</span>
        </label>
        
        {filtersEnabled && (
            <>
                <div className="flex gap-4 items-center">
                    <label className="text-center text-lg dark:text-white" htmlFor="dataInizio"> Da </label>
                    <input name="dataInizio" id="dataInizio" className="border border-black rounded dark:border-0 p-3" type="date"
                    {...register("startDate", {
                        required: filtersEnabled ? "Manca la data di inizio" : false
                    })} />
                { errors.startDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.startDate.message } </p> } 
                </div>
                <div className="flex gap-4 items-center">
                    <label className="text-center text-lg dark:text-white" htmlFor="dataFine"> A </label>
                    <input name="dataFine" id="dataFine" className="border border-black rounded dark:border-0 p-3" type="date"
                    {...register("endDate", {
                        required: filtersEnabled ? "Manca la data di fine" : true
                    })} />
                    { (errors.endDate && <p className="text-center dark:text-red-300 text-red-600"> { errors.endDate.message } </p>) } 
                </div>
                <div className="flex gap-4 items-center">
                    <label className="text-center text-lg dark:text-white" htmlFor="maxResults"> Numero di risultati </label>
                    <input name="maxResults" id="maxResults" className="border w-20 border-black rounded dark:border-0 p-3" type="number"
                    {...register("maxResults", {
                        min: {
                            message: "Minimo 10 tweets",
                            value: "10"
                        },
                        max: {
                            message: "Massimo 100 tweets",
                            value: "100"
                        },
                        required: filtersEnabled ? "Numero mancante" : true
                    })} />
                    { (errors.maxResults && <p className="text-center dark:text-red-300 text-red-600"> { errors.maxResults.message } </p>) } 
                </div>
                
                { (dateError && <p className="text-center dark:text-red-300 text-red-600"> {dateError} </p>) }
            </>)}
    </>
    )
};

export default SearchFilters;