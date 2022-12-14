import PlayerVsPoll from "../components/PlayerVsPoll";

const Chess = () => {
  return (
    <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900 gap-y-6">
      <span className='text-lg text-center dark:text-white font-bold'> Condividi il seguente link ai tuoi sfidanti: <a className="dark:text-sky-400 text-orange-500" href={process.env.REACT_APP_CHESS_USERNAME}>link</a> </span>
      {<PlayerVsPoll />}
    </div>
  );
};

export default Chess;
