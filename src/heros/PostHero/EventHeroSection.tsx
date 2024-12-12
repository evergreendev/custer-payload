import { Event } from '@/payload-types'
import { JSX } from 'react'

const getHourText = (hour: number, minutes: string) => {
  const a = hour > 12 ? 'pm' : 'am'
  const hourText = a === 'am' ? hour || 12 : hour - 12 || 12

  return hourText + ':' + minutes + a
}

export const getHoursFromSchedule = (hours?: string | null, endHours?: string | null) => {
  if (!hours && !endHours) return null
  let date = new Date()
  if (hours) date = new Date(hours)
  const startHour = date.getHours();
  const startMinute = date.getMinutes();

  if (endHours) date = new Date(endHours)
  const endHour = date.getHours();
  const endMinute = date.getMinutes();

  return (`
  ${getHourText(startHour, (startMinute < 10 ? '0' : '') + startMinute) } ${endHours ? `- ${getHourText(endHour, (endMinute < 10 ? '0' : '') + endMinute)}` : ''}
  `
  )
}

const formatDateTime = (timestamp: string, endTime?: string | null): JSX.Element => {
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  let date = new Date()
  if (timestamp) date = new Date(timestamp)
  const months = date.getMonth()
  const days = date.getDate()
  if (endTime) date = new Date(endTime)
  const endMonths = date.getMonth()
  const endDay = date.getDate()

  const MM = months < 10 ? `${months}` : months
  const DD = days < 10 ? `${days}` : days
  const endMM = endMonths < 10 ? `${endMonths}` : endMonths
  const endDD = endDay < 10 ? `${endDay}` : endDay

  return (
    <div className="flex items-center justify-between">
      <div>{`${month[MM]} ${DD}`}</div>
      {MM !== endMM || DD !== endDD ? <div>-</div> : null}
      {MM !== endMM || DD !== endDD ? (
        MM === endMM ? (
          <div>{`${endDD}`}</div>
        ) : (
          <div>{`${month[endMM]} ${endDD}`}</div>
        )
      ) : null}
    </div>
  )
}

const EventHeroSection = ({ event }: { event: Event }) => {
  if (!event.startDate) return null

  return (
    <div className="mb-2">
      <div className="bg-brand-blueBright text-white px-4 py-2 font-bold text-2xl flex mb-2">
        {formatDateTime(event.startDate, event.endDate)}
      </div>
      <div className="px-4">{getHoursFromSchedule(event.startTime, event.endTime)}</div>
    </div>
  )
}

export default EventHeroSection
