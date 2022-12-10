import { setupStore } from "../store/store";
import { CLEAR_STREAM, UPDATE_STREAM } from "./constants";
import { clearStreamAction, endStreamAction, startStreamAction, updateStreamAction } from "./stream";
import { mockQueryNoParams } from "../mocks/api_responses/mockQueryNoParams";
// Mocking the client socket
const io = jest.fn(() => {
    const mockedSocket = {
      on: jest.fn(),
      emit: jest.fn()
    };
    return mockedSocket;
});

describe("clear stream action", () => {
    test("should return an action obj w/type clear stream", () => {
        expect(clearStreamAction().type).toBe(CLEAR_STREAM);
    })
});

describe("update stream action", () => {
    test("should return an action obj w/type update stream", () => {
        expect(updateStreamAction(undefined).type).toBe(UPDATE_STREAM);
    })
    test("should return an action obj w/payload the actual tweet", () => {
        const tweets = mockQueryNoParams
        expect(JSON.stringify(updateStreamAction(tweets).payload)).toBe(JSON.stringify(tweets));
    })
});

describe("start stream action", () => {
    let store;
    beforeEach(() => {
        store = setupStore();
    })
    test("should register socket tweets event",() => {
        const mockedSocket = io();
        store.dispatch(startStreamAction(mockedSocket, "#jjuan01"))
        expect(mockedSocket.on).toHaveBeenCalledWith("tweets", expect.any(Function));
    })
    test("should register emit generic start tag event if provided",() => {
        const mockedSocket = io();
        const tag = "#jjuan01"
        store.dispatch(startStreamAction(mockedSocket, tag))
        expect(mockedSocket.emit).toHaveBeenCalledWith("startGenericStream",tag, tag);
    })
    test("should register emit ghigliottina event if provided",() => {
        const mockedSocket = io();
        const tag = "#leredita"
        store.dispatch(startStreamAction(mockedSocket, tag))
        expect(mockedSocket.emit).toHaveBeenCalledWith("startGhigliottina");
    })
});

describe("end stream action", () => {
    let store;
    beforeEach(() => {
        store = setupStore();
    })
    test("should emit stopGeneric stream if provided",() => {
        const mockedSocket = io();
        const tag = "#jjuan01"
        store.dispatch(endStreamAction(mockedSocket, tag))
        expect(mockedSocket.emit).toHaveBeenCalledWith("stopGenericStream", tag);
    })
    test("should emit stopGhigliottina stream if provided",() => {
        const mockedSocket = io();
        const tag = "#leredita"
        store.dispatch(endStreamAction(mockedSocket, tag))
        expect(mockedSocket.emit).toHaveBeenCalledWith("stopGhigliottina");
    })
});