import { act, renderHook } from '@testing-library/react'
import { useDelayedFlag } from './useDelayedFlag'

describe('useDelayedFlag', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('starts as false', () => {
    const { result } = renderHook(() => useDelayedFlag(false, 150))
    expect(result.current).toBe(false)
  })

  it('remains false while delay has not elapsed', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 150))
    expect(result.current).toBe(false)

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(result.current).toBe(false)
  })

  it('becomes true after full delay with value=true', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 150))

    act(() => {
      jest.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)
  })

  it('cancels timer when value returns to false before the delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDelayedFlag(value, 150),
      { initialProps: { value: true } },
    )

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(result.current).toBe(false)

    rerender({ value: false })

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe(false)
  })

  it('resets to false immediately when value turns false', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDelayedFlag(value, 150),
      { initialProps: { value: true } },
    )

    act(() => {
      jest.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)

    rerender({ value: false })
    expect(result.current).toBe(false)
  })

  it('respects a new delay when delayMs changes', () => {
    const { result, rerender } = renderHook(
      ({ delay }) => useDelayedFlag(true, delay),
      { initialProps: { delay: 150 } },
    )

    rerender({ delay: 500 })

    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(result.current).toBe(false)

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe(true)
  })
})
