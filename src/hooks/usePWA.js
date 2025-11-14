import { useEffect } from 'react'

export const usePWA = () => {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Handle before install prompt
    let deferredPrompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      deferredPrompt = e
      
      // You can show custom install button here
      console.log('PWA install available')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])
}
