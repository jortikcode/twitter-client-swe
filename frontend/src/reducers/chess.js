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
            return {
                ...state,
                votedMoves: {
                    ...state.votedMoves,
                    [info.move]: ++state.votedMoves[info.move] || 1
                }
            }
        case CLEAR_GAME:
            return {
                votedMoves: {},
                winnerMove: ""
            };
        case MAKE_POLL_MOVE:
            // Si sceglie la mossa con piu' voti
            return {
                winnerMove: Object.keys(state.votedMoves).reduce((move1, move2) => state.votedMoves[move1] > state.votedMoves[move2] ? move1 : move2),
                votedMoves: {}
            }
        default:
            return initialState;
    }
}

