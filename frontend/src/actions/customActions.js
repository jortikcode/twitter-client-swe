import { TOGGLE_COLOR_MODE } from './constants'

export const themeAction = (darkMode) => {
    return ({
        type: TOGGLE_COLOR_MODE,
        payload: {darkMode}
    });
}