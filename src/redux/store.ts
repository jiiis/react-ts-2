import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'

import recorderReducer from './recorder'
import eventsReducer from './events'

const rootReducer = combineReducers({
  recorder: recorderReducer,
  events: eventsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store
