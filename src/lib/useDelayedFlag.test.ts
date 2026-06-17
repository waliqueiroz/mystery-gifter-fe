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

  it('inicia como false', () => {
    const { result } = renderHook(() => useDelayedFlag(false, 150))
    expect(result.current).toBe(false)
  })

  it('permanece false enquanto delay não decorre', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 150))
    expect(result.current).toBe(false)

    act(() => {
      jest.advanceTimersByTime(100)
    })
    expect(result.current).toBe(false)
  })

  it('vira true após delay completo com value=true', () => {
    const { result } = renderHook(() => useDelayedFlag(true, 150))

    act(() => {
      jest.advanceTimersByTime(150)
    })
    expect(result.current).toBe(true)
  })

  it('cancela timer quando value volta para false antes do delay', () => {
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

  it('reseta para false imediatamente quando value vira false', () => {
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

  it('respeita um delay novo quando delayMs muda', () => {
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
