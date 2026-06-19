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
    const { showToast } = useToast()
    showToast({ message: 'Salvo!', type: 'success' })
    expect(mockToast.success).toHaveBeenCalledWith('Salvo!')
  })

  it('calls toast.error for type error', () => {
    const { showToast } = useToast()
    showToast({ message: 'Erro ao salvar.', type: 'error' })
    expect(mockToast.error).toHaveBeenCalledWith('Erro ao salvar.')
  })

  it('calls toast for type info', () => {
    const { showToast } = useToast()
    showToast({ message: 'Atenção.', type: 'info' })
    expect(mockToast).toHaveBeenCalledWith('Atenção.')
  })
})
