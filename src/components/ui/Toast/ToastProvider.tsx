'use client'

import { createContext, useCallback, useState } from 'react'
import { Toast, ToastItem, ToastType } from './Toast'

interface ShowToastOptions {
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (options: ShowToastOptions) => void
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
})

const DISMISS_DELAY_MS = 4000

let nextId = 0

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(({ message, type }: ShowToastOptions) => {
    const id = String(nextId++)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, DISMISS_DELAY_MS)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="mg-toast-container" aria-label="Notificações">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
