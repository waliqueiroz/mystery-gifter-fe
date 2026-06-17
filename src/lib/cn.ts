import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Compõe classes Tailwind condicionalmente sem que utilitárias do mesmo "grupo"
 * (ex.: `px-2` e `px-4`) entrem em conflito. Usar SEMPRE em vez de template
 * strings com ternários longos (ver contracts/ui-primitives.md §8).
 *
 * Exemplos:
 *   cn('px-4', 'bg-mg-green', disabled && 'opacity-50')
 *   cn('text-mg-text-muted', isActive && 'text-mg-green', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
