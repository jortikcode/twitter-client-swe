import { UPDATE_HISTORY, CLEAR_GAME, MAKE_POLL_MOVE } from "./constants";

export const startGameAction = (socket, boardAscii, validMoves, username = false) => dispatch => {
    dispatch(clearGame());
    // Handler delle mosse del poll "in entrata" dallo stream
    socket.on('tweets', (move) => {
        if (move === "fin")
            dispatch(makePollMove());
        else
            dispatch(updateHistory(move))
    })
    // Evento per iniziare la partita
    socket.emit("chess", boardAscii, validMoves, username);
}

export const endGameAction = (socket) => dispatch => {   
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