import { configureStore } from '@reduxjs/toolkit'
import { reducer } from '../reducers/index'

export const setupStore = (preloadedState = {}) => {
    return configureStore({
      reducer,
      preloadedState
    });
}