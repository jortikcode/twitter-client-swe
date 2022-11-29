import { CLEAR_STREAM, UPDATE_STREAM } from "./constants";
import { loadingAction } from "./tweets";

export const startStreamAction = (socket, tag) => dispatch => {
    // Handler dei tweet "in entrata" dallo stream
    socket.on('tweets', (tweet) => {
        dispatch(loadingAction(true));
        dispatch(updateStreamAction(tweet));
    })
    // Evento per iniziare lo stream
    if (tag === "#leredita")
        socket.emit("startGhigliottina");
    else
        socket.emit("startGenericStream", tag, "genericTag");
}

export const endStreamAction = (socket, tag) => dispatch => {
    // Evento per smettere di ascoltare lo stream
    if (tag !== "#leredita")
        socket.emit("stopGenericStream", "genericTag");
    else 
        socket.emit("stopGhigliottina");
}

export const updateStreamAction = (tweet) => {
    return ({
        type: UPDATE_STREAM,
        payload: tweet
    })
}

export const clearStreamAction = () => {
    return ({
        type: CLEAR_STREAM
    })
}