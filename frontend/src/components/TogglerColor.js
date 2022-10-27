import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { themeAction } from '../actions/customActions';

// Componente toggler della color mode
const TogglerColor = (props) => {
    const { darkMode } = useSelector(state => state.theme);
    const dispatch = useDispatch();

    const toggleColorMode = (event) => {
        event.preventDefault();
        dispatch(themeAction(darkMode));
    }

    useEffect(() => {
        if (darkMode)
            document.getElementById('root').classList.add('dark');
        else
            document.getElementById('root').classList.remove('dark');
    }, [darkMode, dispatch])
    
    return (
        <button type="button" onClick={toggleColorMode}> 
            <img 
            alt="color mode icon"
            className={`${props?.width || "w-6"} h-auto`} 
            src={`/images/${darkMode ? "light-toggle.png" : "dark-toggle.png"}`} />
        </button>
    );
};
export default TogglerColor;