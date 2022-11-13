import {
    ONE_DAY_MILLISECONDS,
    ONE_HOUR_MILLISECONDS,
    ONE_WEEK_MILLISECONDS
} from './constants'

// Ritorna la data in formato ISO
export function formatISO(date){
    return date.toISOString();
}

export function configureDates(now){
    // Data in formato ISO di oggi
    const todayDefaultFormat = formatYYYYMMDD(formatISO(new Date(Date.now())));
    let today = new Date(todayDefaultFormat);
    // Data in formato ISO di una settimana fa
    let oneWeekAgo = formatISO(new Date(today - ONE_WEEK_MILLISECONDS));
    const oneWeekAgoDefaultFormat = formatYYYYMMDD(oneWeekAgo);
    today = formatISO(today);
    return {
        today,
        oneWeekAgo,
        oneWeekAgoDefaultFormat,
        todayDefaultFormat
    }
}

export function getDateInterval(data, dataToAction, now){
    // La data di fine deve essere "shiftata" di 24 ore in avanti
    let shiftedEndDate = Date.parse(data.endDate);

    shiftedEndDate = new Date(shiftedEndDate + ONE_DAY_MILLISECONDS - ONE_HOUR_MILLISECONDS);
    // Bisogna evitare che la data shiftata vada oltre il giorno odierno 
    shiftedEndDate = shiftedEndDate.getTime() > now ? new Date(now) : shiftedEndDate;
    data.endDate = formatISO(shiftedEndDate); 

    return {
        ...dataToAction,
        startDate: secondsGranularity(data.startDate),
        endDate: secondsGranularity(data.endDate)
    }
}

export function transformQuery(query){
    // Espressioni regolari per la ricerca tramite hashtag (@hashtag) o nome utente (@username)
    const hashtagSearchRegex = new RegExp("^(#)[a-zA-Z0-9]+$");
    const userSearchRegex = new RegExp("^(@)[a-zA-Z0-9]+$");
    if (hashtagSearchRegex.test(query))
        query = "%23"+ query.split('#')[1];
    else if (userSearchRegex.test(query))
        query = "%40"+ query.split('@')[1];
    return query;
}

export function secondsGranularity(isoDate){
    const isoSecondsGranularity = `${isoDate.substring(0, isoDate.length - 7)}00.000Z`;
    return isoSecondsGranularity;
}

// Ritorna la data in formato YYYY-MM-DD, l'argomento e' una data in formato ISO 
export function formatYYYYMMDD(isoDate){
    return isoDate.split('T')[0];
}

export function isValidDateRange(startDateString, endDateString, todayString, oneWeekAgoString){
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    const today = new Date(todayString);
    const oneWeekAgo = new Date(oneWeekAgoString);
    let response = {
        msg: "Valid",
        isValid: true
    };
    if (startDate > endDate)
        response = {
            msg: "La data di inizio e' oltre la data di fine dell'intervallo",
            isValid: false
        }
    else if (endDate > today)
        response = {
            msg: "La data di fine e' oltre la data odierna, non e' possibile cercare tweet del futuro!",
            isValid: false
        }   
    else if (startDate < oneWeekAgo)
        response = {
            msg: "La data di inizio dell'intervallo e' oltre una settimana fa, puoi cercare tweet solo all'interno dell'ultima settimana",
            isValid: false
        }
    return response;
}

export const isIntervalSetted = (data, filtersEnabled, noIntervalSearch, oneWeekAgoIso, todayIso) => {
    return (data.startDate !== oneWeekAgoIso || data.endDate !== todayIso || data.username) && filtersEnabled && !noIntervalSearch;
}