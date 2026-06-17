/**
 * Mock para `next/font/google` em ambiente Jest.
 *
 * No build real do Next.js, funções como `Manrope({...})` e `Noto_Sans({...})`
 * baixam as fontes em build time e devolvem `{ className, style, variable }`.
 * Em testes unitários não temos build do Next, então qualquer chamada de
 * função do `next/font/google` retorna um objeto com strings vazias.
 *
 * Cobertura: as fontes usadas pelo produto são exportadas explicitamente para
 * facilitar leitura, mas o Proxy abaixo garante que QUALQUER função importada
 * (`Manrope`, `Noto_Sans`, `Noto_Sans_Arabic`, etc.) devolva o mesmo objeto.
 */

const fontReturn = {
  className: '',
  style: {},
  variable: '',
}

const fontFactory = (): typeof fontReturn => fontReturn

export const Manrope = fontFactory
export const Noto_Sans = fontFactory

const handler: ProxyHandler<Record<string, typeof fontFactory>> = {
  get: (_target, prop) => {
    if (prop === 'Manrope') return Manrope
    if (prop === 'Noto_Sans') return Noto_Sans
    return fontFactory
  },
}

export default new Proxy({}, handler)
