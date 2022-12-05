import { combineReducers } from '@reduxjs/toolkit'
import { theme } from './theme'
import { tweets } from './tweets'
import { form } from './form'
import { chess } from './chess'
import { fantacitorio } from './fantacitorio'


export const reducer = combineReducers({ theme, tweets, form, chess, fantacitorio });