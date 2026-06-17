import { cn } from './cn'

describe('cn', () => {
  it('concatena classes simples separadas por espaço', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('ignora valores falsy (undefined, false, null, "")', () => {
    expect(cn('px-4', undefined, false, null, '', 'py-2')).toBe('px-4 py-2')
  })

  it('aceita classes condicionais via clsx', () => {
    const isActive = true
    const isDisabled = false

    expect(
      cn(
        'base',
        isActive && 'text-mg-green',
        isDisabled && 'opacity-50',
      ),
    ).toBe('base text-mg-green')
  })

  it('resolve conflito entre utilitárias do mesmo grupo mantendo a última', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
    expect(cn('bg-mg-surface', 'bg-mg-green')).toBe('bg-mg-green')
  })

  it('preserva utilitárias de grupos distintos quando ambas se aplicam', () => {
    expect(cn('px-4 py-2', 'bg-mg-green')).toBe('px-4 py-2 bg-mg-green')
  })

  it('aceita arrays e objetos no formato clsx', () => {
    expect(cn(['px-4', { 'text-mg-green': true, 'opacity-50': false }])).toBe(
      'px-4 text-mg-green',
    )
  })

  it('retorna string vazia quando nada é passado', () => {
    expect(cn()).toBe('')
  })
})
