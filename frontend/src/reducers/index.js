import { combineReducers } from '@reduxjs/toolkit'
import { theme } from './theme'
import { tweets } from './tweets'


export const reducer = combineReducers({ theme, tweets })