import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const PremiumHero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (heroRef.current) {
      gsap.to(heroRef.current, {
        scale: 1.05,
        duration: 12,
        ease: 'none',
      })
    }

    if (headlineRef.current) {
      const text = headlineRef.current
      const words = text.textContent?.split(' ') || []
      text.innerHTML = words
        .map((word) => `<span class="inline-block">${word} </span>`)
        .join('')

      gsap.from(text.children, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power2.out',
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with parallax */}
      <div
        ref={heroRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/hero/voice-abstract.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl"
        >
          <h1
            ref={headlineRef}
            className="font-serif text-5xl md:text-7xl font-medium text-white leading-tight tracking-tight-plus mb-6"
          >
            The Pursuit of Conversational Excellence.
          </h1>

          <p className="text-lg md:text-xl text-stone max-w-2xl mb-8">
            ODIADEV builds the voice AI infrastructure that powers WhatsApp, Telegram
            and Web agents — fast, reliable, and truly Nigerian-built.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                // TODO: Open chat widget
              }}
              className="bg-gold hover:bg-gold-soft text-navy-900 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Talk to the Assistant
            </button>
            <a
              href="#request-demo"
              className="border border-gold/30 hover:border-gold text-gold hover:text-gold-soft px-6 py-3 rounded-md font-medium transition-colors"
            >
              Request a Demo
            </a>
          </div>
        </motion.div>
      </div>

      {/* Gold hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </section>
  )
}
