import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearTweets } from "../actions/tweets";
import SearchForm from "../components/SearchForm";
const SearchPage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(clearTweets())
    }, [dispatch])
    return (
        <div className="min-h-screen h-auto" >
            <SearchForm />    
        </div>
    );
};
export default SearchPage;