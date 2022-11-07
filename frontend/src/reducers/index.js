import { combineReducers } from '@reduxjs/toolkit'
import { theme } from './theme'
import { tweets } from './tweets'
import { form } from './form'


export const reducer = combineReducers({ theme, tweets, form })