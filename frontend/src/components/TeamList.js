import Tweet from "./Tweet";
import { useSelector } from "react-redux";

const TeamList = () => {
    let { medias, users, types, creationDates } = useSelector(state => state.fantacitorio);

    return (
        <>
        { ((medias.length > 0) && (
            <div data-testid="tweetListContainer" className="pt-8 flex gap-y-10 flex-col justify-center items-center md:w-4/6 w-4/5 dark:text-white">
                {medias.map((media, index) =>
                {
                    const creationDate = new Date(creationDates[index]);
                    return (<Tweet
                        fantacitorio={true}
                        key={index}
                        teamImageUrl={media.type === "photo" ? media.url : ""}
                        name={users[index].name} 
                        username={users[index].username} 
                        pfpUrl={users[index].pfpUrl}
                        type={types[index]}
                        date={`il ${creationDate.toLocaleDateString()} alle ${creationDate.toLocaleTimeString()}`}/>)})}
            </div> 
        )) }
        </>
    );
}

export default TeamList;