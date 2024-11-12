
export type WithId<T> = T & { id: string}

export type Course = {
  title: string
  description: string
  day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
  type: 'AERIAL_YOGA' | 'FAMILY_YOGA' | 'FLOW_YOGA'
  start_time: string
  price: number
  capacity: number
  duration: number

  local_id: number

  /** timestamp in ms */
  created_at: number
}

export type Schedule = {
  course_nano_id: string
  course_id: number
  local_id: number
  teacher: string
  comment?: string

  /** timestamp in ms */
  start_date: number
}

export type Order = {
  user_id: string
  course_nano_id: string
  schedule_nano_id: string
  created_at: number
}