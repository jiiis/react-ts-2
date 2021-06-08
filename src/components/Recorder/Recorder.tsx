import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

import { normalizeTime } from '../../lib/utils'
import { selectDateStart, start, stop } from '../../redux/recorder'
import { createEvent } from '../../redux/events'

import './Recorder.css'

const Recorder = () => {
  const dispatch = useDispatch()

  const dateStart = useSelector(selectDateStart)

  const started = dateStart !== ''

  const timer = useRef<number>()

  const [, setCount] = useState(0)

  const onRecordButtonClick = () => {
    if (started) {
      window.clearInterval(timer.current)

      dispatch(createEvent())
      dispatch(stop())
    } else {
      dispatch(start())

      timer.current = window.setInterval(() => {
        setCount((count) => count + 1)
      }, 1000)
    }
  }

  useEffect(() => {
    return () => {
      window.clearInterval(timer.current)
    }
  }, [])

  let seconds = started
    ? Math.floor((Date.now() - new Date(dateStart).getTime()) / 1000)
    : 0

  const hours = seconds ? Math.floor(seconds / 60 / 60) : 0

  seconds -= hours * 60 * 60

  const minutes = seconds ? Math.floor(seconds / 60) : 0

  seconds -= minutes * 60

  return (
    <div className={cx('recorder', { 'recorder-started': started })}>
      <button className="recorder-record" onClick={onRecordButtonClick}>
        <span></span>
      </button>
      <div className="recorder-counter">
        {normalizeTime(hours)}:{normalizeTime(minutes)}:{normalizeTime(seconds)}
      </div>
    </div>
  )
}

export default Recorder
