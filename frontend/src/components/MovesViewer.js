import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

const MovesViewer = () => {
    const { votedMoves } = useSelector(state => state.chess);
    const [ moves, setMoves ] = useState([]);

    useEffect(() => {
        const isEmpty = JSON.stringify(votedMoves) === JSON.stringify({}); 
        if (!isEmpty)
            setMoves(Object.keys(votedMoves));
        else
            setMoves([]);
    }, [ votedMoves ]); 

    return (
        <div className="flex flex-col">
        <span className='text-lg dark:text-white font-bold text-center'> Mosse degli avversari in real-time: </span>
        <table className="table-auto text-center">
            <thead>
                <tr className="dark:text-white">
                    <th className="p-2">
                        Mossa
                    </th>
                    <th className="p-2">
                        Voti
                    </th>
                </tr>
            </thead>
            <tbody className="dark:text-sky-400 font-bold text-amber-800">
                {moves.map(move => (
                    <tr key={move}>
                        <td> {move} </td>
                        <td> {votedMoves[move]} </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}

export default MovesViewer;