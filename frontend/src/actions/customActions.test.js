import { 
    SEARCH_FAIL,
    NO_MATCHES} from "./constants";
import { 
    searchFail,
    noMatches } from "./customActions"

describe("customActions testing", () => {
    it("searchFail()", () => {
        const action = searchFail();
        expect(action.type).toEqual(SEARCH_FAIL);
    });

    it("noMathes()", () => {
        const action = noMatches();
        expect(action.type).toEqual(NO_MATCHES);
    });
});