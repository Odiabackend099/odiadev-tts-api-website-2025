import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export const TrustBar = () => {
  return (
    <section className="bg-mist/5 py-16">
      <div className="container-xl">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {/* Replace with actual client logos later */}
          <motion.div
            variants={item}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 mb-4 flex items-center justify-center">
              <span className="text-gold-soft">🎓</span>
            </div>
            <h3 className="text-gold-soft font-serif text-xl mb-2">
              University Deployments
            </h3>
            <p className="text-stone text-sm">
              Serving Nigerian universities with AI-powered student support
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 mb-4 flex items-center justify-center">
              <span className="text-gold-soft">⚕️</span>
            </div>
            <h3 className="text-gold-soft font-serif text-xl mb-2">
              Healthcare Assistants
            </h3>
            <p className="text-stone text-sm">
              Supporting patient care with voice-enabled AI companions
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 mb-4 flex items-center justify-center">
              <span className="text-gold-soft">💼</span>
            </div>
            <h3 className="text-gold-soft font-serif text-xl mb-2">
              SME Support Bots
            </h3>
            <p className="text-stone text-sm">
              Empowering small businesses with 24/7 customer service
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Gold hairline */}
      <div className="mt-16 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </section>
  )
}
