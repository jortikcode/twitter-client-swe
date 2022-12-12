import {
    REPLY,
    RETWEET,
    TWEET,
    QUOTED,
    NOTYPE
} from "../utils/constants";
import { getPrefix } from "./tweets";

describe('tweets.getPrefix test', () => {
    test('reply tweet type', () => {
        expect(getPrefix(REPLY)).toEqual('Ha risposto');
    });
    test('retweet tweet type', () => {
        expect(getPrefix(RETWEET)).toEqual('Ha retwittato');
    });
    test('tweet tweet type', () => {
        expect(getPrefix(TWEET)).toEqual('Ha twittato');
    });
    test('quoted tweet type', () => {
        expect(getPrefix(QUOTED)).toEqual('Ha citato');
    });
    test('notype tweet type', () => {
        expect(getPrefix(NOTYPE)).toEqual(NOTYPE);
    });
})