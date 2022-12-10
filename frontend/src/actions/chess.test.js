import { startGameAction, clearGame, makePollMove, updateHistory, endGameAction } from "./chess"
import { CLEAR_GAME, MAKE_POLL_MOVE, UPDATE_HISTORY } from "./constants"
import { setupStore } from "../store/store";

// Mocking the client socket
const io = jest.fn(() => {
    const mockedSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      removeAllListeners: jest.fn(),
      disconnect: jest.fn()
    };
    return mockedSocket;
});

const emptyChess = {
    votedMoves: {},
    winnerMove: ""
}

describe("clear game action", () => {
    test("should return an action obj w/type clear game", () => {
        expect(clearGame().type).toBe(CLEAR_GAME);
    })
});

describe("make poll move action", () => {
    test("should return an action obj w/type make poll move", () => {
        expect(makePollMove().type).toBe(MAKE_POLL_MOVE);
    })
});

describe("update game action", () => {
    test("should return an action obj w/type update history", () => {
        const move = "d4"
        expect(updateHistory(move).type).toBe(UPDATE_HISTORY);
    })
    test("should return an action payload the move", () => {
        const move = "d4"
        expect(JSON.stringify(updateHistory(move).payload)).toBe(JSON.stringify({ move }));
    })
});

describe("start game action", () => {
    let store;
    beforeEach(() => {
        store = setupStore();
    })
    test("should register socket tweets event",() => {
        const mockedSocket = io();
        const boardFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        const validMoves = ["a6", "d6"]
        store.dispatch(startGameAction(mockedSocket, boardFEN, validMoves, "jjuan01"))
        expect(mockedSocket.on).toHaveBeenCalledWith("tweets", expect.any(Function));
    })
    test("should emit remove old tweets listeners",() => {
        const mockedSocket = io();
        const boardFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        const validMoves = ["a6", "d6"]
        store.dispatch(startGameAction(mockedSocket, boardFEN, validMoves, "jjuan01"))
        expect(mockedSocket.removeAllListeners).toHaveBeenCalledWith("tweets");
    })
    test("should emit socket chess event",() => {
        const mockedSocket = io();
        const boardFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        const validMoves = ["a6", "d6"]
        store.dispatch(startGameAction(mockedSocket, boardFEN, validMoves, "jjuan01"))
        expect(mockedSocket.emit).toHaveBeenCalledWith("chess", boardFEN, validMoves, "jjuan01");
    })
});

describe("end game action", () => {
    let store;
    beforeEach(() => {
        store = setupStore();
    })
    test("should disconnect socket if it is provided",() => {
        const mockedSocket = io();
        store.dispatch(endGameAction(mockedSocket))
        expect(mockedSocket.disconnect).toHaveBeenCalled();
    })
    test("should clear the game state",() => {
        store.dispatch(endGameAction(undefined))
        expect(JSON.stringify(store.getState().chess)).toBe(JSON.stringify(emptyChess));
    })
});