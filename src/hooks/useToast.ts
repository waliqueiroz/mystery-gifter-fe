'use client'

import { toast } from 'sonner'

interface ShowToastOptions {
  message: string
  type: 'success' | 'error' | 'info'
}

export function useToast() {
  return {
    showToast: ({ message, type }: ShowToastOptions) => {
      if (type === 'success') toast.success(message)
      else if (type === 'error') toast.error(message)
      else toast(message)
    },
  }
}
