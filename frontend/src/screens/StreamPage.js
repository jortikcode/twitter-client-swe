import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { clearTweets } from "../actions/tweets";
import StreamWatcher from "../components/StreamWatcher";


const StreamPage = () => {
  const { handleSubmit, 
          register,
          formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const [ hashtag, setHashtag ] = useState(undefined);

  const onSubmit = (data) => {
    setHashtag(undefined);
    setHashtag(data.hashtag);
  }

  useEffect(() => {
    dispatch(clearTweets());
  }, [dispatch]);

  return (
    <div className="flex flex-col w-full min-h-screen h-auto p-5 items-center dark:bg-gray-900 gap-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col justify-center items-center gap-4">
        <label className="text-center text-3xl dark:text-sky-400 text-black" htmlFor="query"> Leggi cosa dicono in tempo reale! </label>
        <input
          className="w-full dark:border-0 border-8 dark:border-white rounded-md md:w-96 p-3"
          name="hashtag"
          id="hashtag"
          type="text"
          placeholder="#hashtag"
          {...register("hashtag", {
            required: "Hashtag mancante",
            pattern: {
              message: "Hashtag non valido",
              value: /^#\w+$/,
            },
          })}
        />
        {errors.hashtag && <p className="text-center dark:text-red-300 text-red-600"> { errors.hashtag.message } </p>}
        <button className="text-3xl dark:text-white bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit"> Ascolta </button>
      </form>
      {hashtag && <StreamWatcher tag={hashtag} />}
    </div>
  );
};
export default StreamPage;
