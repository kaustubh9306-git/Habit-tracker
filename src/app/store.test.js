import { describe, expect, it } from 'vitest'
import { reducer, validateData } from './store'
const base = { habits: [{ id: 'a' }], completions: [], selectedDate: '2026-10-06' }
describe('reducer', () => {
  it('toggles a completion on and off without mutating', () => {
    const on = reducer(base, { type: 'TOGGLE_COMPLETION', habitId: 'a', date: '2026-10-06' })
    expect(on.completions).toHaveLength(1); expect(base.completions).toHaveLength(0)
    expect(reducer(on, { type: 'TOGGLE_COMPLETION', habitId: 'a', date: '2026-10-06' }).completions).toHaveLength(0)
  })
  it('archive keeps completions; delete removes them', () => {
    const s = { ...base, completions: [{ id: '1', habitId: 'a', date: '2026-10-06', completed: true }] }
    expect(reducer(s, { type: 'ARCHIVE_HABIT', id: 'a' }).completions).toHaveLength(1)
    expect(reducer(s, { type: 'DELETE_HABIT', id: 'a' }).completions).toHaveLength(0)
  })
})
describe('validateData', () => {
  it('rejects junk and accepts valid backups', () => {
    expect(validateData(null)).toBe(false); expect(validateData({ habits: 1 })).toBe(false)
    expect(validateData({ habits: [{ id: 'a', name: 'A', frequency: { type: 'daily' }, createdAt: '2026-10-01' }], completions: [{ habitId: 'a', date: '2026-10-02' }] })).toBe(true)
  })
})
