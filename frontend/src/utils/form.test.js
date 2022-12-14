import { configureDates, formatISO, formatYYYYMMDD, getDateInterval, isIntervalSetted, isValidDateRange, secondsGranularity } from "./form";


describe('form module test', () => {
    test('should produce ISO string', () => {
        const date = new Date();
        expect(formatISO(date)).toEqual(date.toISOString());
    });

    test('should produce YYYY-MM-DD format', () => {
        const date = new Date();
        const year = date.getFullYear();
        // I mesi sono indicizzati a partire da 0
        const month = date.getMonth() + 1;
        const day = date.getDate()
        const format = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        expect(formatYYYYMMDD(formatISO(date))).toEqual(format);
    });

    test('should produce consistent formats', () => {
        const { today, oneWeekAgo, todayDefaultFormat, oneWeekAgoDefaultFormat} = configureDates(new Date());
        expect(formatYYYYMMDD(today)).toEqual(todayDefaultFormat);
        expect(formatYYYYMMDD(oneWeekAgo)).toEqual(oneWeekAgoDefaultFormat);
    });

    test('should produce ISO string with zeroed seconds', () => {
        const dateISO = formatISO(new Date());
        const end = dateISO.length - 7;
        expect(secondsGranularity(dateISO)).toEqual(`${dateISO.substring(0, end)}00.000Z`);
    });

    test('should make the date interval object', () => {
        const dataToAction = {test: 'value'};
        const data = {
            startDate: '2022-12-08T01:00:00.496Z',
            endDate: '2022-12-09T01:00:00.496Z',
        };
        const now = '2022-12-12T01:00:00.496Z';

        const result = getDateInterval(data, dataToAction, now);
        expect(result.startDate).toEqual(secondsGranularity(data.startDate));
        expect(result.test).toEqual(dataToAction.test);
    });

    test('valid date range test', () => {
        let startDate, endDate;
        const oneWeekAgo = '2022-12-08T00:00:00.000Z';
        const today = '2022-12-08T08:00:00.000Z';

        startDate = '2022-12-08T03:00:00.000Z';
        endDate = '2022-12-08T02:00:00.000Z';
        expect(isValidDateRange(startDate, endDate, today, oneWeekAgo).isValid).toEqual(false);

        startDate = '2022-12-08T03:00:00.000Z';
        endDate = '2022-12-08T09:00:00.000Z';
        expect(isValidDateRange(startDate, endDate, today, oneWeekAgo).isValid).toEqual(false);

        startDate = '2022-11-25T03:00:00.000Z';
        endDate = '2022-12-08T02:00:00.000Z';
        expect(isValidDateRange(startDate, endDate, today, oneWeekAgo).isValid).toEqual(false);

        startDate = '2022-12-08T02:00:00.000Z';
        endDate = '2022-12-08T03:00:00.000Z';
        expect(isValidDateRange(startDate, endDate, today, oneWeekAgo).isValid).toEqual(true);
    });
    
    test('valid interval set test', () => {
        const oneWeekAgo = '2022-12-08T01:00:00.000Z';
        const today = '2022-12-08T08:01:00.000Z';
        const data = {
            startDate: oneWeekAgo,
            endDate: today,
        };

        expect(isIntervalSetted(data, true, false, oneWeekAgo, today)).toBeFalsy();

        data.username = 'someUsername';
        expect(isIntervalSetted(data, false, false, oneWeekAgo, today)).toBeFalsy();
        expect(isIntervalSetted(data, true, true, oneWeekAgo, today)).toBeFalsy();
        expect(isIntervalSetted(data, true, false, oneWeekAgo, today)).toBeTruthy();


    })
})