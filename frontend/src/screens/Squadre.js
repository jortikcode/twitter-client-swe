import { useSelector } from 'react-redux';
import SearchForm from '../components/SearchForm'
import LoadingSpinner from '../components/LoadingSpinner';
import TeamList from '../components/TeamList';

const Squadre = () => {
    const { isLoadingFantacitorio } = useSelector(state => state.fantacitorio);
    return (
        <>
            <SearchForm fantacitorio={true} />
            <LoadingSpinner isVisible={isLoadingFantacitorio} />
            <TeamList />
        </>
    )
};
export default Squadre;