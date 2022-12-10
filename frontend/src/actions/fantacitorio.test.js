import { mockFantacitorioTeams } from "../mocks/api_responses/mockFantacitorioTeams";
import { mockFantacitorioScores } from "../mocks/api_responses/mockFantacitorioScores";
import { CLEAR_FANTACITORIO, LOADING_FANTACITORIO, SCORES_SUCCESS, TEAM_SUCCESS, UPDATE_SCOREBOARD } from "./constants";
import { clearFantacitorio, loadingFantacitorio, scores, scoreSuccess, teams, teamSuccess, updateScoreboardEntry } from "./fantacitorio";
import { setupStore } from "../store/store";
import { mockFantacitorioWeeklyScores } from "../mocks/api_responses/mockFantacitorioWeeklyScores";

const initialFantacitorio = {
    users: [],
    creationDates: [],
    types: [],
    medias: [],
    scores: [],
    previousToken: '',
    nextToken: '',
    bestSingleScore: {},
    isLoadingFantacitorio: false
}

describe("update scoreboard action", () => {
    test("should return an action obj w/type update scoreboard", () => {
        expect(updateScoreboardEntry(1).type).toBe(UPDATE_SCOREBOARD);
    });
    test("should return an action obj with updated payload", () => {
        expect(JSON.stringify(updateScoreboardEntry(1).payload)).toBe(JSON.stringify({
            score: 1,
            index: -1
        }));
    });
});

describe("loading fantacitorio action", () => {
    test("should return an action obj w/type loading fantacitorio", () => {
        expect(loadingFantacitorio(false).type).toBe(LOADING_FANTACITORIO);
    });
    test("should return an action obj w/payload false if passed as argument", () => {
        expect(loadingFantacitorio(false).payload.isLoading).toBe(false);
    })
    test("should return an action obj w/payload true if passed as argument", () => {
        expect(loadingFantacitorio(true).payload.isLoading).toBe(true);
    })
});

describe("clear fantacitorio action", () => {
    test("should return an obj w/type clear fantacitorio", () => {
        expect(clearFantacitorio().type).toBe(CLEAR_FANTACITORIO);
    });
});

describe("score success action", () => {
    test("should return an obj w/type scores success", () => {
        expect(scoreSuccess([]).type).toBe(SCORES_SUCCESS);
    })
    test("should return an obj containing scores & bestSingleScore as payload", () => {
        expect(JSON.stringify(scoreSuccess(mockFantacitorioScores.data, mockFantacitorioScores.bestSingleScore).payload)).toBe(JSON.stringify(mockFantacitorioScores));
    })
});

describe("team success action", () => {
    test("should return an obj w/type team success", () => {
        expect(teamSuccess().type).toBe(TEAM_SUCCESS);
    })
    test("should return an obj teams as payload", () => {
        const mockCopy = {...mockFantacitorioTeams}
        mockCopy.previousToken = "";
        expect(JSON.stringify(teamSuccess(
            mockFantacitorioTeams.creationDates,
            mockFantacitorioTeams.users,
            mockFantacitorioTeams.types,
            mockFantacitorioTeams.medias,
            mockFantacitorioTeams.nextToken,
            mockFantacitorioTeams.previousToken
        ).payload)).toBe(JSON.stringify(mockCopy));
    })
});
describe("teams action", () => {
    let store;
    beforeEach(() => {
        store = setupStore();
    })
    test("should update fantacitorio teams when succeed", async () => {
        const mockCopy = {...mockFantacitorioTeams}
        mockCopy.previousToken = "";
        await store.dispatch(teams({ type: "keyword" }));
        expect(JSON.stringify(store.getState().fantacitorio)).toBe(JSON.stringify({...initialFantacitorio , ...mockCopy}));
    })
    test("should set noMatch to true when teams are not found", async () => {
        await store.dispatch(teams({ type: "username", username: "fedeborci1" }))
        expect(store.getState().tweets.noMatch).toBe(true);
    })
});

describe("scores action", () => {
    let store;
    beforeEach(() => {
        store = setupStore();
    })
    test("should update fantacitorio scoreboard when succeed", async () => {
        const mockCopy = {...mockFantacitorioWeeklyScores}
        mockCopy.previousToken = "";
        await store.dispatch(scores({ type: "weeklyPoints" }));
        expect(JSON.stringify(store.getState().fantacitorio.scores)).toBe(JSON.stringify(mockCopy.data));
        expect(JSON.stringify(store.getState().fantacitorio.bestSingleScore)).toBe(JSON.stringify(mockCopy.bestSingleScore));
    })
});

