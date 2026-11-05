'use client'

import { useEffect } from 'react'

/** ثبت سرویس‌ورکر برای امکان نصب اپ (PWA) روی گوشی و دسکتاپ */
export function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // اگر ثبت نشد، اپ همچنان عادی کار می‌کند
      })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [])

  return null
}
