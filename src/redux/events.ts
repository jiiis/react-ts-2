import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { omit } from 'lodash'

import { RootState } from './store'
import { selectDateStart } from './recorder'

export interface IEvent {
  id: number
  title: string
  dateStart: string
  dateEnd: string
}

interface IEventsState {
  ids: IEvent['id'][]
  events: Record<IEvent['id'], IEvent>
}

// Actions
const ACTION_TYPE_LOAD_EVENTS = 'events/load'

const ACTION_TYPE_LOAD_EVENTS_SUCCESS = 'events/load-success'

const ACTION_TYPE_LOAD_EVENTS_FAILURE = 'events/load-failure'

const ACTION_TYPE_CREATE_EVENT = 'events/create'

const ACTION_TYPE_CREATE_EVENT_SUCCESS = 'events/create-success'

const ACTION_TYPE_CREATE_EVENT_FAILURE = 'events/create-failure'

const ACTION_TYPE_UPDATE_EVENT = 'events/update'

const ACTION_TYPE_UPDATE_EVENT_SUCCESS = 'events/update-success'

const ACTION_TYPE_UPDATE_EVENT_FAILURE = 'events/update-failure'

const ACTION_TYPE_DELETE_EVENT = 'events/delete'

const ACTION_TYPE_DELETE_EVENT_SUCCESS = 'events/delete-success'

const ACTION_TYPE_DELETE_EVENT_FAILURE = 'events/delete-failure'

interface IActionLoadEvents extends Action<typeof ACTION_TYPE_LOAD_EVENTS> {}

interface IActionLoadEventsSuccess
  extends Action<typeof ACTION_TYPE_LOAD_EVENTS_SUCCESS> {
  payload: {
    events: IEvent[]
  }
}

interface IActionLoadEventsFailure
  extends Action<typeof ACTION_TYPE_LOAD_EVENTS_FAILURE> {
  payload: {
    error: string
  }
}

interface IActionCreateEvent extends Action<typeof ACTION_TYPE_CREATE_EVENT> {}

interface IActionCreateEventSuccess
  extends Action<typeof ACTION_TYPE_CREATE_EVENT_SUCCESS> {
  payload: {
    event: IEvent
  }
}

interface IActionCreateEventFailure
  extends Action<typeof ACTION_TYPE_CREATE_EVENT_FAILURE> {
  payload: {
    error: string
  }
}

interface IActionUpdateEvent extends Action<typeof ACTION_TYPE_UPDATE_EVENT> {}

interface IActionUpdateEventSuccess
  extends Action<typeof ACTION_TYPE_UPDATE_EVENT_SUCCESS> {
  payload: {
    event: IEvent
  }
}

interface IActionUpdateEventFailure
  extends Action<typeof ACTION_TYPE_UPDATE_EVENT_FAILURE> {
  payload: {
    error: string
  }
}

interface IActionDeleteEvent extends Action<typeof ACTION_TYPE_DELETE_EVENT> {}

interface IActionDeleteEventSuccess
  extends Action<typeof ACTION_TYPE_DELETE_EVENT_SUCCESS> {
  payload: {
    eventId: IEvent['id']
  }
}

interface IActionDeleteEventFailure
  extends Action<typeof ACTION_TYPE_DELETE_EVENT_FAILURE> {
  payload: {
    error: string
  }
}

export const loadEvents =
  (): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    IActionLoadEvents | IActionLoadEventsSuccess | IActionLoadEventsFailure
  > =>
  async (dispatch) => {
    dispatch({ type: ACTION_TYPE_LOAD_EVENTS })

    try {
      const response = await fetch('http://localhost:3001/events')
      const events: IEvent[] = await response.json()

      dispatch({
        type: ACTION_TYPE_LOAD_EVENTS_SUCCESS,
        payload: { events },
      })
    } catch (error) {
      dispatch({
        type: ACTION_TYPE_LOAD_EVENTS_FAILURE,
        payload: { error: 'Failed to load events!' },
      })
    }
  }

export const createEvent =
  (): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    IActionCreateEvent | IActionCreateEventSuccess | IActionCreateEventFailure
  > =>
  async (dispatch, getState) => {
    dispatch({ type: ACTION_TYPE_CREATE_EVENT })

    try {
      const dateStart = selectDateStart(getState())
      const event: Omit<IEvent, 'id'> = {
        title: 'No name',
        dateStart,
        dateEnd: new Date().toISOString(),
      }
      const response = await fetch('http://localhost:3001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
      const createdEvent: IEvent = await response.json()

      dispatch({
        type: ACTION_TYPE_CREATE_EVENT_SUCCESS,
        payload: { event: createdEvent },
      })
    } catch (error) {
      dispatch({
        type: ACTION_TYPE_CREATE_EVENT_FAILURE,
        payload: { error: 'Failed to create event!' },
      })
    }
  }

export const updateEvent =
  (
    event: IEvent
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    IActionUpdateEvent | IActionUpdateEventSuccess | IActionUpdateEventFailure
  > =>
  async (dispatch) => {
    dispatch({ type: ACTION_TYPE_UPDATE_EVENT })

    try {
      const response = await fetch(`http://localhost:3001/events/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(omit(event, ['id'])),
      })

      const eventUpdated = await response.json()

      dispatch({
        type: ACTION_TYPE_UPDATE_EVENT_SUCCESS,
        payload: { event: eventUpdated },
      })
    } catch (error) {
      dispatch({
        type: ACTION_TYPE_UPDATE_EVENT_FAILURE,
        payload: { error: 'Failed to update event!' },
      })
    }
  }

export const deleteEvent =
  (
    eventId: IEvent['id']
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    IActionDeleteEvent | IActionDeleteEventSuccess | IActionDeleteEventFailure
  > =>
  async (dispatch) => {
    dispatch({ type: ACTION_TYPE_DELETE_EVENT })

    try {
      await fetch(`http://localhost:3001/events/${eventId}`, {
        method: 'DELETE',
      })

      dispatch({
        type: ACTION_TYPE_DELETE_EVENT_SUCCESS,
        payload: { eventId },
      })
    } catch (error) {
      dispatch({
        type: ACTION_TYPE_DELETE_EVENT_FAILURE,
        payload: { error: 'Failed to delete event!' },
      })
    }
  }

// Selectors
export const selectEventsState = (rootState: RootState) => rootState.events

export const selectEventsArray = (rootState: RootState) =>
  Object.values(selectEventsState(rootState).events)

// Reducer
const initialEventsState: IEventsState = {
  ids: [],
  events: {},
}

const eventsReducer = (
  state: IEventsState = initialEventsState,
  action:
    | IActionLoadEventsSuccess
    | IActionCreateEventSuccess
    | IActionUpdateEventSuccess
    | IActionDeleteEventSuccess
) => {
  switch (action.type) {
    case ACTION_TYPE_LOAD_EVENTS_SUCCESS:
      const { events } = action.payload

      return {
        ...state,
        ids: events.map(({ id }) => id),
        events: events.reduce<IEventsState['events']>((eventMap, event) => {
          eventMap[event.id] = event

          return eventMap
        }, {}),
      }
    case ACTION_TYPE_CREATE_EVENT_SUCCESS:
      const { event: eventCreated } = action.payload

      return {
        ...state,
        ids: [...state.ids, eventCreated.id],
        events: { ...state.events, [eventCreated.id]: eventCreated },
      }
    case ACTION_TYPE_UPDATE_EVENT_SUCCESS:
      const { event: eventUpdated } = action.payload

      return {
        ...state,
        events: { ...state.events, [eventUpdated.id]: eventUpdated },
      }
    case ACTION_TYPE_DELETE_EVENT_SUCCESS:
      const { eventId } = action.payload

      return {
        ids: state.ids.filter((id) => id !== eventId),
        events: omit(state.events, [eventId]),
      }
    default:
      return state
  }
}

export default eventsReducer
