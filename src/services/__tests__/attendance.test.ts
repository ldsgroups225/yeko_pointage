import { describe, expect, it } from 'vitest'
import { parseTimeString } from '@/utils/dateTime'

// Test the time parsing logic directly
describe('attendance time handling', () => {
  it('should parse time strings correctly', () => {
    const timeString = '10:52'
    const parsedDate = parseTimeString(timeString)

    expect(parsedDate.getHours()).toBe(10)
    expect(parsedDate.getMinutes()).toBe(52)
  })

  it('should add 15 minutes correctly', () => {
    const timeString = '10:52'
    const parsedDate = parseTimeString(timeString)
    parsedDate.setMinutes(parsedDate.getMinutes() + 15)

    expect(parsedDate.getHours()).toBe(11)
    expect(parsedDate.getMinutes()).toBe(7)
  })

  it('should handle hour boundary correctly', () => {
    const timeString = '10:50'
    const parsedDate = parseTimeString(timeString)
    parsedDate.setMinutes(parsedDate.getMinutes() + 15)

    expect(parsedDate.getHours()).toBe(11)
    expect(parsedDate.getMinutes()).toBe(5)
  })

  it('should format time back to string correctly', () => {
    const timeString = '10:52'
    const parsedDate = parseTimeString(timeString)
    parsedDate.setMinutes(parsedDate.getMinutes() + 15)

    const hours = parsedDate.getHours().toString().padStart(2, '0')
    const minutes = parsedDate.getMinutes().toString().padStart(2, '0')
    const formattedTime = `${hours}:${minutes}`

    expect(formattedTime).toBe('11:07')
  })

  it('should handle the specific error case from the logs', () => {
    // This test reproduces the exact scenario from the error logs:
    // startTime: "10:52", defaultEndTime: "12:00", status: "late"
    const startTime = '10:52'
    const defaultEndTime = '12:00'
    const status = 'late'

    // Simulate the getEndTime function logic
    let result: string
    if (status !== 'late') {
      result = defaultEndTime
    }
    else {
      const startDate = parseTimeString(startTime)
      startDate.setMinutes(startDate.getMinutes() + 15)

      const hours = startDate.getHours().toString().padStart(2, '0')
      const minutes = startDate.getMinutes().toString().padStart(2, '0')
      result = `${hours}:${minutes}`
    }

    expect(result).toBe('11:07')
    expect(() => parseTimeString(startTime)).not.toThrow()
    expect(() => parseTimeString(defaultEndTime)).not.toThrow()
  })
})
