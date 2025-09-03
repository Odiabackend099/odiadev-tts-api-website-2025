import { motion } from 'framer-motion'

export const CtaBand = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-navy overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-radial from-gold/5 via-transparent to-transparent" />

      {/* Content */}
      <div className="container-xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-8">
            Ready to hear your business speak?
          </h2>
          <p className="text-stone text-lg mb-10 max-w-xl mx-auto">
            Join leading Nigerian businesses using ODIADEV to transform their customer
            experience with voice AI.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            onClick={() => {
              // TODO: Open intake form
            }}
          >
            Start Intake
          </motion.button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  )
}
