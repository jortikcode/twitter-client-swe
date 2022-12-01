import {
  clearStreamAction,
  startStreamAction,
  endStreamAction,
} from "../actions/stream";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { clearTweets } from "../actions/tweets";
import ChartsView from "../screens/ChartsView";
import TweetList from "./TweetList";

const StreamWatcher = ({ tag }) => {
  const [socket, setSocket] = useState(undefined);
  const { textTweets, isLoading } = useSelector((state) => state.tweets);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearTweets());
    return () => {
      dispatch(clearStreamAction());
    }
  }, [dispatch]);
  useEffect(() => {
    // Quando al componente viene fatta una operazione di "unmount", ci disconnettiamo dal server socket
    return () => {
      if (socket){
        dispatch(endStreamAction(socket, tag));
        socket.disconnect();
      }
    };
  }, [dispatch, tag, socket]);

  return (
    <>
      <button
        className="md:text-3xl text-lg dark:text-white bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
        onClick={(e) => {
          if (socket){
            dispatch(endStreamAction(socket, tag));
            socket.disconnect()
            setSocket(undefined);
          } else {
            const newSocket = io(process.env.REACT_APP_BASE_API_URL);
            setSocket(newSocket);
            dispatch(clearStreamAction());
            dispatch(startStreamAction(newSocket, tag));
          }
        }}
      >
        {socket ? `Termina ${tag}` : `[in live] Vedi ${tag}`}
      </button>
      {textTweets.length > 0 && !isLoading && (
        <>
          <ChartsView /> <TweetList />
        </>
      )}
    </>
  );
};

export default StreamWatcher;
