import { Action } from 'redux'

import { RootState } from './store'

type StartAction = Action<typeof ACTION_TYPE_START>
type StopAction = Action<typeof ACTION_TYPE_STOP>

interface IRecorderState {
  dateStart: string
}

// Actions
const ACTION_TYPE_START = 'recorder/start'
const ACTION_TYPE_STOP = 'recorder/stop'

// Action creators
export const start = (): StartAction => ({
  type: ACTION_TYPE_START,
})

export const stop = (): StopAction => ({
  type: ACTION_TYPE_STOP,
})

// Selectors
export const selectRecorderState = (rootState: RootState) => rootState.recorder

export const selectDateStart = (rootState: RootState) => selectRecorderState(rootState).dateStart

// Reducer
const initialRecorderState: IRecorderState = {
  dateStart: ''
}

const recorderReducer = (
  state: IRecorderState = initialRecorderState,
  action: StartAction | StopAction
) => {
  switch (action.type) {
    case ACTION_TYPE_START:
      return { ...state, dateStart: new Date().toISOString() }
    case ACTION_TYPE_STOP:
      return { ...state, dateStart: '' }
    default:
      return state
  }
}

export default recorderReducer
