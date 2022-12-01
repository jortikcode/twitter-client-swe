import { 
    NO_MATCHES } from "./constants";

import {
    noMatches } from "./tweets"

describe("customActions testing", () => {

    it("noMathes()", () => {
        const action = noMatches();
        expect(action.type).toEqual(NO_MATCHES);
    });
});
