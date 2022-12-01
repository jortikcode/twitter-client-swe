import ContenutoHomepage from "../components/ContenutoHomepage";
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { clearTweets } from "../actions/tweets";
const Homepage = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(clearTweets())
    }, [dispatch])
    return (
        <>
            <ContenutoHomepage />
        </>
    );
};
export default Homepage;