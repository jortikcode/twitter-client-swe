import { useSelector } from 'react-redux';
import SearchForm from '../components/SearchForm'
import LoadingSpinner from '../components/LoadingSpinner';

const Squadre = () => {
    const { isLoadingFantacitorio } = useSelector(state => state.fantacitorio);
    return (
        <>
            <SearchForm fantacitorio={true} />
            <LoadingSpinner isVisible={isLoadingFantacitorio} />
        </>
    )
};
export default Squadre;