import { oneWeekTimestamp } from "../utils/constants.js";

function isIsoDate(str) {
  return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str);
}

export function checkDates(start_time, end_time) {
  try {
    const today = Date.now();
    if (start_time) {
      if (!isIsoDate(start_time)) {
        throw "Parametro start_time non valido, non è in formato iso 8601";
      }
      const start = Date.parse(start_time);
      if (start < today - oneWeekTimestamp) {
        throw "Data di inizio non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }
    if (end_time) {
      if (!isIsoDate(end_time)) {
        throw "Parametro end_time non valido, non è in formato iso 8601";
      }
      const end = Date.parse(end_time);
      if (end > today) {
        throw "Data di fine non valida, le date valide sono solo quelle nell'arco dell'ultima settimana";
      }
    }
    if (start_time && end_time) {
      if (Date.parse(start_time) > Date.parse(end_time)) {
        throw "Date non valide, la data di inizio è dopo della data di fine";
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}
