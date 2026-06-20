import { renderHook } from '@testing-library/react'
import { toast } from 'sonner'
import { useToast } from './useToast'

jest.mock('sonner', () => ({
  toast: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
  }),
}))

const mockToast = toast as jest.MockedFunction<typeof toast> & {
  success: jest.MockedFunction<typeof toast.success>
  error: jest.MockedFunction<typeof toast.error>
}

beforeEach(() => jest.clearAllMocks())

describe('useToast', () => {
  it('calls toast.success for type success', () => {
    const { result } = renderHook(() => useToast())
    result.current.showToast({ message: 'Salvo!', type: 'success' })
    expect(mockToast.success).toHaveBeenCalledWith('Salvo!')
  })

  it('calls toast.error for type error', () => {
    const { result } = renderHook(() => useToast())
    result.current.showToast({ message: 'Erro ao salvar.', type: 'error' })
    expect(mockToast.error).toHaveBeenCalledWith('Erro ao salvar.')
  })

  it('calls toast for type info', () => {
    const { result } = renderHook(() => useToast())
    result.current.showToast({ message: 'Atenção.', type: 'info' })
    expect(mockToast).toHaveBeenCalledWith('Atenção.')
  })

  it('returns a stable showToast reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useToast())
    const first = result.current.showToast
    rerender()
    expect(result.current.showToast).toBe(first)
  })
})
