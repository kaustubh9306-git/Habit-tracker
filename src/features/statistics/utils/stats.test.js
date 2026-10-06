import { describe, expect, it } from 'vitest'
import { calculateCompletionRate, calculateCurrentStreak, calculateLongestStreak, calculateOverallStreaks } from './stats'
import { completionIndex } from '../../completions/utils/completions'
import { isHabitScheduledForDate } from '../../habits/utils/schedule'
import { addDays, isValidKey, parseKey, toKey } from '../../../lib/date'

// 2026-10-05 is a Monday
const MON = '2026-10-05'
const habit = (frequency, createdAt = MON) => ({ id: 'h', name: 'H', icon: 'x', color: 'green', frequency, createdAt, archived: false })
const done = (...dates) => completionIndex(dates.map((date) => ({ habitId: 'h', date, completed: true })))

describe('dates', () => {
  it('round-trips without timezone drift', () => { expect(toKey(parseKey('2026-03-08'))).toBe('2026-03-08'); expect(addDays('2026-10-31', 1)).toBe('2026-11-01') })
  it('validates keys', () => { expect(isValidKey('2026-02-30')).toBe(false); expect(isValidKey('2026-02-28')).toBe(true) })
})
describe('scheduling', () => {
  it('ignores dates before creation and unscheduled weekdays', () => {
    const h = habit({ type: 'weekly', days: [1, 3, 5] })
    expect(isHabitScheduledForDate(h, '2026-10-04')).toBe(false)
    expect(isHabitScheduledForDate(h, '2026-10-06')).toBe(false)
    expect(isHabitScheduledForDate(h, '2026-10-07')).toBe(true)
  })
})
describe('streaks', () => {
  it('unscheduled days do not break a Mon/Wed/Fri streak', () => {
    const h = habit({ type: 'weekly', days: [1, 3, 5] })
    const idx = done('2026-10-05', '2026-10-07', '2026-10-09')
    expect(calculateCurrentStreak(h, idx, '2026-10-09')).toBe(3)
    expect(calculateLongestStreak(h, idx, '2026-10-11')).toBe(3)
  })
  it('a missed day resets the current streak (spec example)', () => {
    const h = habit({ type: 'daily' })
    const idx = done('2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-11')
    expect(calculateCurrentStreak(h, idx, '2026-10-11')).toBe(1)
    expect(calculateLongestStreak(h, idx, '2026-10-11')).toBe(5)
  })
  it('an unfinished today does not break the streak', () => {
    const h = habit({ type: 'daily' })
    expect(calculateCurrentStreak(h, done('2026-10-05', '2026-10-06'), '2026-10-07')).toBe(2)
  })
  it('overall streak needs every scheduled habit done', () => {
    const a = habit({ type: 'daily' })
    expect(calculateOverallStreaks([a], done('2026-10-05', '2026-10-06'), '2026-10-06')).toEqual({ current: 2, longest: 2 })
  })
})
describe('completion rate', () => {
  it('divides by scheduled occurrences, not calendar days', () => {
    const h = habit({ type: 'weekly', days: [1, 3, 5] })
    const dates = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09']
    expect(calculateCompletionRate([h], done('2026-10-05', '2026-10-07'), dates)).toBe(67)
  })
  it('returns null when nothing was scheduled', () => { expect(calculateCompletionRate([habit({ type: 'weekly', days: [1] })], done(), ['2026-10-06'])).toBeNull() })
})
