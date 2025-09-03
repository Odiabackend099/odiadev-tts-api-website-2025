import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Providers } from './components/Providers'
import { FloatingChatWidget } from './components/chat/FloatingChatWidget'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <Providers>
      <RouterProvider router={router} />
      <FloatingChatWidget />
    </Providers>
  )
}

export default App
