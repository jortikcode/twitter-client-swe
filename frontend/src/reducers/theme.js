import { TOGGLE_COLOR_MODE } from "../actions/constants";

const initialState = {
  darkMode: true,
};

export const theme = (state = initialState, data) => {
  if (data.type === TOGGLE_COLOR_MODE) {
    return {
      darkMode: !data.payload.darkMode,
    };
  } else {
    return state;
  }
};
