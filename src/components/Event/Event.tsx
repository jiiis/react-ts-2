import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { deleteEvent, IEvent, updateEvent } from '../../redux/events'

interface IProps {
  event: IEvent
}

const Event: React.FC<IProps> = ({ event }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(event.title)
  const dispatch = useDispatch()
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus()
    }
  }, [isEditingTitle])

  const onCloseButtonClick = () => {
    dispatch(deleteEvent(event.id))
  }

  const onTitleClick = () => {
    setIsEditingTitle(true)
  }

  const onTitleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleInput(event.target.value)
  }

  const onTitleInputBlur = () => {
    setIsEditingTitle(false)

    if (titleInput !== event.title) {
      dispatch(updateEvent({ ...event, title: titleInput }))
    }
  }

  return (
    <div className="calendar-event">
      <div className="calendar-event-info">
        <div className="calendar-event-time">
          {event.dateStart} - {event.dateEnd}
        </div>
        <div className="calendar-event-title">
          {isEditingTitle ? (
            <input
              type="text"
              ref={titleInputRef}
              value={titleInput}
              onChange={onTitleInputChange}
              onBlur={onTitleInputBlur}
            />
          ) : (
            <span onClick={onTitleClick}>{event.title}</span>
          )}
        </div>
      </div>
      <div
        className="calendar-event-delete-button"
        onClick={onCloseButtonClick}
      >
        &times;
      </div>
    </div>
  )
}

export default Event
