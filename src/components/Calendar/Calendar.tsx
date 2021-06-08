import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { RootState } from '../../redux/store'
import { IEvent, loadEvents, selectEventsArray } from '../../redux/events'

import './Calendar.css'
import { normalizeTime } from '../../lib/utils'
import Event from '../Event'

const getDateKey = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()

  return `${year}-${normalizeTime(month)}-${normalizeTime(day)}`
}

const groupEventsByDay = (events: IEvent[]) => {
  const groups: Record<string, IEvent[]> = {}

  events.forEach((event) => {
    const startDateKey = getDateKey(new Date(event.dateStart))
    const endDateKey = getDateKey(new Date(event.dateEnd))

    groups[startDateKey] = groups[startDateKey]
      ? [...groups[startDateKey], event]
      : [event]

    if (endDateKey !== startDateKey) {
      groups[endDateKey] = groups[endDateKey]
        ? [...groups[endDateKey], event]
        : [event]
    }
  })

  return groups
}

const mapStateToProps = (state: RootState) => ({
  events: selectEventsArray(state),
})

const mapDispatchToProps = {
  loadEvents,
}

const connector = connect(mapStateToProps, mapDispatchToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

interface IProps extends PropsFromRedux {}

const Calendar: React.FC<IProps> = ({ events, loadEvents }) => {
  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const groupedEvents = groupEventsByDay(events)
  const sortedGroupKeys = Object.keys(groupedEvents).sort(
    (date1, date2) => +new Date(date2) - +new Date(date1)
  )

  return groupedEvents ? (
    <div className="calendar">
      {sortedGroupKeys.map((dayKey) => {
        const events = groupedEvents[dayKey]
        const groupDate = new Date(dayKey)
        const day = groupDate.getDate()
        const month = groupDate.toLocaleString(undefined, {
          month: 'long',
          timeZone: 'UTC',
        })

        return (
          <div key={dayKey} className="calendar-day">
            <div className="calendar-day-label">
              <span>
                {day} {month}
              </span>
            </div>
            <div className="calendar-events">
              {events.map((event) => (
                <Event key={event.id} event={event} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    <p>Loading...</p>
  )
}

export default connector(Calendar)
