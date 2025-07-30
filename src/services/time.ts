interface TimeApiResponse {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  seconds: number
  milliSeconds: number
  dateTime: string
  date: string
  time: string
  timeZone: string
  dayOfWeek: string
  dstActive: boolean
}

export const time = {
  async getCurrentTime(): Promise<Date> {
    try {
      const response = await fetch(
        'https://timeapi.io/api/time/current/zone?timeZone=Africa%2FAbidjan',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: TimeApiResponse = await response.json()
      return new Date(data.dateTime)
    }
    catch (error) {
      console.error('Failed to fetch current time from API, falling back to local time:', error)
      return new Date()
    }
  },
}
