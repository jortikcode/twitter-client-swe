import { 
    UPDATE_HISTORY,
    CLEAR_GAME,
    MAKE_POLL_MOVE,
} from "../actions/constants";

const initialState = {
    votedMoves: {},
    winnerMove: ""
};

export function chess(state = initialState, data){
    const info = data.payload;
    switch(data.type){
        case UPDATE_HISTORY:
            let value = state.votedMoves[info.move];
            return {
                ...state,
                votedMoves: {
                    ...state.votedMoves,
                    [info.move]: ++value || 1
                }
            }
        case CLEAR_GAME:
            return {
                ...initialState
            };
        case MAKE_POLL_MOVE:
            const winnerMove = Object.keys(state.votedMoves).reduce((move1, move2) => {return move2}, Object.keys(state.votedMoves)[0]);
            console.log(winnerMove);
            return {
                ...initialState,
                winnerMove
            }
        default:
            return {...initialState};
    }
}

