import { configureStore } from '@reduxjs/toolkit'
import { reducer } from '../reducers/index'

export const store = configureStore( { reducer } );
// export const store = createStore(reducer, applyMiddleware(thunk));