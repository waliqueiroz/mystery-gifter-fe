'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'

interface ShowToastOptions {
  message: string
  type: 'success' | 'error' | 'info'
}

export function useToast() {
  const showToast = useCallback(({ message, type }: ShowToastOptions) => {
    if (type === 'success') toast.success(message)
    else if (type === 'error') toast.error(message)
    else toast(message)
  }, [])

  return { showToast }
}
