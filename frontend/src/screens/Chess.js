import PlayerVsPoll from "../components/PlayerVsPoll";

const Chess = () => {
  return (
    <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900 gap-y-6">
      {<PlayerVsPoll />}
    </div>
  );
};

export default Chess;
