import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
  searchAction,
  dateErrorAction,
  loadingAction,
  clearTweets,
} from "../actions/tweets";
import {
  clearFantacitorio,
  loadingFantacitorio,
  teams
} from '../actions/fantacitorio'
import {
  formatISO,
  isValidDateRange,
  transformQuery,
  getDateInterval,
  configureDates,
  isIntervalSetted,
} from "../utils/form";
import SearchFilters from "./SearchFilters";
import { useState, useEffect } from "react";
import PageManager from "./PageManager";
import TabManager from "./TabManager";
import LoadingSpinner from './LoadingSpinner'
import { Outlet } from "react-router-dom";

const SearchForm = ({ fantacitorio }) => {
  // Timestamp di adesso shiftato di error millisecondi indietro
  const error = 60 * 1000;
  const now = new Date(Date.now() - error);
  // Setup delle date
  const { today, oneWeekAgo, todayDefaultFormat, oneWeekAgoDefaultFormat } =
    configureDates(now);
  // Oggetti utile per la manipolazione del form con lo hook useForm
  const {
    setValue,
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: oneWeekAgoDefaultFormat,
      endDate: todayDefaultFormat,
      maxResults: 10,
      noIntervalSearch: false,
    },
  });

  /* watch permette di tenere il valore di specifici input */
  const noIntervalSearch = watch("noIntervalSearch", false);

  // Stato per tenere traccia del tipo della ricerca: per utente o per parola chiave
  const [type, setType] = useState("username");
  const [storedData, setStoredData] = useState({
    type: "",
    query: "",
    username: "",
    startDate: "",
    endDate: "",
  });

  // Il dispatch viene utilizzato per riuscire a manipolare lo stato centralizzato di redux
  const dispatch = useDispatch();
  const { noMatch, textTweets, isLoading } =
    useSelector(state => fantacitorio ? state.fantacitorio : state.tweets);

  const { filtersEnabled } = useSelector((state) => state.form);

  useEffect(() => {
    return () => {
        if (fantacitorio)
            dispatch(clearFantacitorio());
        else
            dispatch(clearTweets());
    }
  }, [dispatch, fantacitorio])

  // Funzione di submit del form
  const onSubmit = (data) => {
    // Se le date sono state settate, allora bisogna prenderne il formato ISO
    data.startDate =
      data.startDate && filtersEnabled
        ? formatISO(new Date(data.startDate))
        : oneWeekAgo;
    data.endDate =
      data.endDate && filtersEnabled
        ? formatISO(new Date(data.endDate))
        : today;

    /* Check sull'intervallo delle date, deve valere:
        1. startDate < endDate
        2. endDate > oneWeekago
        3. startDate < today */
        const { isValid, msg } = isValidDateRange(
          data.startDate,
          data.endDate,
          today,
          oneWeekAgo
        );
        if (! isValid){
            dispatch(dateErrorAction(msg))
        }else{
            if (fantacitorio)
                dispatch(clearFantacitorio());
            else
                dispatch(clearTweets());
            // Spinner di caricamento visibile
            if (fantacitorio)
                dispatch(loadingFantacitorio(true))
            else
                dispatch(loadingAction(true));
            // Se si tratta di una keyword search di un hashtag/utente allora bisogna cambiare la query
            data.query = transformQuery(data.query);
            dispatch(dateErrorAction(""));
            
            // Dati da mandare per la ricerca
            let dataToAction = {};
            dataToAction["type"] = type;
            dataToAction["query"] = data.query;
            dataToAction["username"] = data.username;

      // E' stato settato un intervallo temporale dall'utente
      if (
        isIntervalSetted(
          data,
          filtersEnabled,
          noIntervalSearch,
          oneWeekAgo,
          today
        )
      )
        dataToAction = getDateInterval(data, dataToAction, now);

            if (data.maxResults !== 10 && filtersEnabled)
                dataToAction["maxResults"] = data.maxResults;
            // Si aggiornano i dati della ricerca corrente
            setStoredData(dataToAction);
            // Si attiva l'azione per la ricerca e si aggiorna lo stato centralizzato
            if (fantacitorio)
                dispatch(teams(dataToAction));
            else
                dispatch(searchAction(dataToAction));
        }
        
    }
  return (
    <>
      <div className="flex flex-col w-full h-auto p-5 items-center dark:bg-gray-900">
        <form
          className="flex w-full flex-col justify-center items-center gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
            {!fantacitorio ? <label className="text-center text-3xl dark:text-sky-400 text-black" htmlFor="query"> Cosa vorresti cercare? </label> :
            (type === "username" ? <label className="text-center text-3xl dark:text-sky-400 text-black"> Cerca un utente e scopri la sua squadra! </label> :
            <label className="text-center text-3xl dark:text-sky-400 text-black"> Cerca le squadre di questa settimana! </label>)}
            <div className="flex md:flex-row flex-col justify-center items-center md:space-x-3 space-x-0 md:space-y-0 space-y-3">
              <button
                data-testid="typeSearchToggle"
                type="button"
                className="p-2 bg-sky-400 rounded-full ml-3"
                onClick={(e) => {
                  const newType = type === "username" ? "keyword" : "username";
                  if (newType === "keyword")
                    setValue("noIntervalSearch", false);
                  setType(newType);
                }}
              >
                {
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {type === "username" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      ></path>
                    ) : (!fantacitorio ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                    </path>) }
                  </svg>
                }
              </button>
              {(type === "keyword" && !fantacitorio) ? (
                <input
                  className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3"
                  name="query"
                  id="query"
                  type="text"
                  placeholder="#hashtag, keyword. @utente"
                  {...register("query", {
                    required: "Testo mancante",
                    pattern: {
                      message: "Keyword non valido",
                      value: /^([#@])?\w+$/,
                    },
                  })}
                />
              ) : (type === "username" ? 
                (<input
                  className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3"
                  name="username"
                  id="username"
                  type="text"
                  placeholder="utente senza @"
                  {...register("username", {
                    required: "Testo mancante",
                    pattern: {
                      message: "Username non valido",
                      value: /^\w+$/,
                    },
                  })}
                />) : ""
              )}
            </div>
            {errors.query && (
              <p className="text-center dark:text-red-300 text-red-600">
                {" "}
                {errors.query.message}{" "}
              </p>
            )}
            {errors.username && (
              <p className="text-center dark:text-red-300 text-red-600">
                {" "}
                {errors.username.message}{" "}
              </p>
            )}
          </div>
          <SearchFilters
            type={type}
            setValue={setValue}
            register={register}
            errors={errors}
            noIntervalSearch={noIntervalSearch}
          />
          <button
            className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            {" "}
            Cerca{" "}
          </button>
        </form>
        {noMatch ? (
          <p className="pt-5 pb-5 dark:text-yellow-300">
            Nessun risultato trovato
          </p>
        ) : textTweets?.length === 0 && !isLoading ? (
          <p className="pt-5 pb-5 dark:text-yellow-300">Effettua una ricerca</p>
        ) : (!isLoading && !fantacitorio) ? (
          <p className="pt-5 pb-5 dark:text-green-400">
            Ricerca effettuata! Seleziona la visualizzazione{" "}
          </p>
        ) : (
          ""
        )}
        <div className="pt-8">
            {!fantacitorio && <TabManager />}
        </div>

        {isLoading  && (     
        <LoadingSpinner isVisible={isLoading} />
        )}

        <div className="pt-3">
          <PageManager data={storedData} fantacitorio={fantacitorio}/>
        </div>
        {!fantacitorio && <Outlet />}
      </div>
    </>
  );
};

export default SearchForm;