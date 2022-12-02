/* global describe test expect */
import { isIsoDate, checkDates } from "../utils/dateCheck.js";
import { previusISODate } from "./testUtils.js";

describe("Test function isIsoDate", () => {
  test("should be true with a valid date", () => {
    const output = isIsoDate(previusISODate(0));
    expect(output).toBe(true);
  });
  test("should be false with a non valid date", () => {
    const output = isIsoDate(new Date());
    expect(output).toBe(false);
  });
});

describe("Test function checkDates", () => {
  test("should return true with valid start_time and end_time", () => {
    const output = checkDates(previusISODate(6), previusISODate(4));
    expect(output).toBe(true);
  });
  test("should throw an error with non ISO start_time", () => {
    expect(() => {
      checkDates(new Date(), new Date());
    }).toThrow("Parametro start_time non valido, non è in formato iso 8601");
  });
  test("should throw an error with non valid start_time", () => {
    expect(() => {
      checkDates(previusISODate(9), new Date());
    }).toThrow(
      "Data di inizio non valida, le date valide sono solo quelle nell'arco dell'ultima settimana"
    );
  });
  test("should throw an error with non ISO end_time", () => {
    expect(() => {
      checkDates(previusISODate(6), new Date());
    }).toThrow("Parametro end_time non valido, non è in formato iso 8601");
  });
  test("should throw an error with non valid end_time", () => {
    expect(() => {
      checkDates(previusISODate(6), previusISODate(-1));
    }).toThrow(
      "Data di fine non valida, le date valide sono solo quelle nell'arco dell'ultima settimana"
    );
  });
  test("should throw an error with start_time > end_time", () => {
    expect(() => {
      checkDates(previusISODate(3), previusISODate(5));
    }).toThrow("Date non valide, la data di inizio è dopo della data di fine");
  });
});
