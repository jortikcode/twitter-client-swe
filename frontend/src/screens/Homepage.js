import ContenutoHomepage from "../components/ContenutoHomepage";
import Search from "../components/Search";
import TogglerColor from "../components/TogglerColor";
const Homepage = () => {
    return (
        <>
            <TogglerColor />
            <ContenutoHomepage />
            <Search />
        </>
    );
};
export default Homepage;