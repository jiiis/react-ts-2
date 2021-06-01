import { AnyAction } from 'redux'

interface IEvent {
  id: number
  title: string
  dateStart: string
  dateEnd: string
}

interface IEventsState {
  ids: IEvent['id'][]
  events: Record<IEvent['id'], IEvent>
}

const initialEventsState: IEventsState = {
  ids: [],
  events: {},
}

const eventsReducer = (
  state: IEventsState = initialEventsState,
  action: AnyAction
) => {
  switch (action.type) {
    default:
      return state
  }
}

export default eventsReducer
