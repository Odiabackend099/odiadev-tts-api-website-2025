import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const WhatWeDoSplit = () => {
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image with parallax */}
          <div ref={imageRef} className="relative h-[600px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-overlay opacity-40" />
            <img
              src="/assets/hero/voice-abstract.jpg" // Placeholder - replace with actual image
              alt="Voice AI Infrastructure"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gold border effect */}
            <div className="absolute inset-0 border border-gold/20 rounded-lg" />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              We are your Voice AI Operations Team.
            </h2>
            <p className="text-stone text-lg mb-8">
              From design to deployment, we deliver voice-enabled agents tuned for
              sales, support and operations. Start manually, template later, scale
              when ready.
            </p>

            <div className="space-y-6">
              {/* Features */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold">🎯</span>
                </div>
                <div>
                  <h3 className="text-gold-soft font-serif text-xl mb-2">
                    Custom Voice Design
                  </h3>
                  <p className="text-stone">
                    Craft the perfect voice personality for your brand with our
                    Nigerian and global voice options.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold">🔄</span>
                </div>
                <div>
                  <h3 className="text-gold-soft font-serif text-xl mb-2">
                    Seamless Integration
                  </h3>
                  <p className="text-stone">
                    Deploy across WhatsApp, Telegram, and Web with unified
                    conversation management.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold">📈</span>
                </div>
                <div>
                  <h3 className="text-gold-soft font-serif text-xl mb-2">
                    Scale with Confidence
                  </h3>
                  <p className="text-stone">
                    Enterprise-ready infrastructure with monitoring, analytics, and
                    dedicated support.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
