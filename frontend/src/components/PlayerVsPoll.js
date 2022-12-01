import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import Chess from 'chess.js'
import { Chessboard } from 'react-chessboard';
import { clearGame, endGameAction, startGameAction } from '../actions/chess';
import uniqid from 'uniqid';
import { io } from 'socket.io-client';

const MAX_WIDTH = 600;

export default function PlayVsPoll() {
  const chessboardRef = useRef();
  const [chessboardSize, setChessboardSize] = useState(undefined);
  // Username della partita
  const username = uniqid();
  const [socket, setSocket] = useState();
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState('white');
  const dispatch = useDispatch();
  const { winnerMove } = useSelector(state => state.chess);

  useEffect(() => {
    function handleResize() {
      const display = window.innerWidth > MAX_WIDTH ? MAX_WIDTH : window.innerWidth;
      setChessboardSize(display - 20);
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize)
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (socket){
        dispatch(endGameAction(socket));
        setSocket(undefined);
      }
    };
  }, [dispatch, socket]);

  useEffect(() => {
    if (winnerMove !== "")
      safeGameMutate((game) => {
        game.move(winnerMove);
      });
      dispatch(clearGame());
  }, [winnerMove, dispatch]);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makePollMove() {
    const possibleMoves = game.moves();
    const boardFEN = game.fen();
    console.log(boardFEN.replaceAll("\n", "^"));
    // exit if the game is over
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return;
    if (!socket){
      const newSocket = io(process.env.REACT_APP_BASE_API_URL);
      setSocket(newSocket)
      dispatch(startGameAction(newSocket, boardFEN, possibleMoves, true, username));
    }else
      dispatch(startGameAction(socket, boardFEN, possibleMoves, false, username));
  }

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = {...game};
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen for example simplicity
    });
    setGame(gameCopy);
    // illegal move
    if (move === null) return false;

    makePollMove();   
    return true;
  }

  return (
    <>
      <span className='text-lg dark:text-white font-bold'> Stai giocando come <span className="text-amber-800 dark:text-yellow-300">{username}</span> </span>
      <Chessboard
        id="PlayVsRandom"
        animationDuration={200}
        boardOrientation={boardOrientation}
        boardWidth={chessboardSize}
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: '4px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
        }}
        ref={chessboardRef}
      />
      <button
        className="rc-button md:text-xl text-lg dark:text-white bg-sky-500 hover:bg-sky-700 text-white py-2 px-4 rounded mt-5"
        onClick={() => {
          dispatch(endGameAction(socket));
          setSocket(undefined);
          safeGameMutate((game) => {
            game.reset();
          });
        }}
      >
        Termina Partita
      </button>
      <button
        className="rc-button md:text-xl text-lg dark:text-white bg-sky-500 hover:bg-sky-700 text-white py-2 px-4 rounded mt-2"
        onClick={() => {
          setBoardOrientation((currentOrientation) => (currentOrientation === 'white' ? 'black' : 'white'));
        }}
      >
        Flip board
      </button>
    </>
  );
}
