import { combineReducers, createStore } from 'redux'

import recorderReducer from './recorder'
import eventsReducer from './events'

const rootReducer = combineReducers({
  recorder: recorderReducer,
  events: eventsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer)

export default store
