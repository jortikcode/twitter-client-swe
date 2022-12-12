import { joinWordcloudInfo, joinSearchSentimentAnalysis } from "../utils/stream";

describe('stream module test', () => {
    test('should return empty array', () => {
        expect(joinWordcloudInfo([], []).length).toEqual(0);
    });

    test('should join the infos and sort them', () => {
        const info1 = [{
            text: 'text a',
            value: 4,
        }, {
            text: 'text b',
            value: 3
        }];
        const info2 = [{
            text: 'text c',
            value: 2,
        }, {
            text: 'text d',
            value: 1
        }];
        const joinedInfos = joinWordcloudInfo(info1, info2);

        expect(joinedInfos.length).toEqual(info1.length + info2.length);
        for (const i in joinedInfos) {
            // Salta il primo elemento dato che non ha un precedente
            if (i === '0') continue;
            expect(joinedInfos[i-1].value).toBeGreaterThanOrEqual(joinedInfos[i].value);
        }
    });

    test('should contain all the provided texts', () => {
        const texts = ['text a', 'text b', 'text c'];
        const info1 = [{
            text: texts[0],
            value: 1,
        }, {
            text: texts[1],
            value: 1,
        }];
        const info2 = [{
            text: texts[2],
            value: 1,
        }];
        const joinedInfos = joinWordcloudInfo(info1, info2);

        expect(joinedInfos.map(info => info.text)).toEqual(expect.arrayContaining(texts));
        expect(texts).toEqual(expect.arrayContaining(joinedInfos.map(info => info.text)));
    });

    test('shouldn\'t duplicate text', () => {
        const text = 'text a';
        const value1 = 1, value2 = 2;
        const info1 = [{
            text: text,
            value: value1,
        }];
        const info2 = [{
            text: text,
            value: value2,
        }];
        const joinedInfos = joinWordcloudInfo(info1, info2);

        expect(joinedInfos.length).toEqual(1);
        expect(joinedInfos[0].text).toEqual(text);
        expect(joinedInfos[0].value).toEqual(value1 + value2);
    });
})