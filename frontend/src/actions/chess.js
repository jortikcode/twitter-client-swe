import { UPDATE_HISTORY, CLEAR_GAME, MAKE_POLL_MOVE } from "./constants";

  

export const startGameAction = (socket, boardAscii, validMoves, username) => dispatch => {
    // Handler delle mosse del poll "in entrata" dallo stream
    socket.removeAllListeners("tweets");
    socket.on("tweets", (move) => {
        if (move === "fin")
            dispatch(makePollMove());
        else if (validMoves.includes(move))
            dispatch(updateHistory(move))
        else
            dispatch(updateHistory(validMoves[0]));
    })
    // Evento per iniziare la partita
    socket.emit("chess", boardAscii, validMoves, username);
}

export const endGameAction = (socket) => dispatch => {
    if (socket)
        socket.disconnect();
    dispatch(clearGame())
}

export const clearGame = () => {
    return ({
        type: CLEAR_GAME
    })
}

export const updateHistory = (move) => {
    return ({
        type: UPDATE_HISTORY,
        payload: {
            move
        }
    })
}

export const makePollMove = () => {
    return ({
        type: MAKE_POLL_MOVE
    })
}