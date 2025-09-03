import { motion } from 'framer-motion'

const valueProps = [
  {
    title: 'Real-Time Voice',
    desc: 'Low-latency TTS with Nigerian-accent voices and global options.',
    icon: '🎙️',
  },
  {
    title: 'Omnichannel',
    desc: 'WhatsApp, Telegram, and Web chat widget — one brain, many channels.',
    icon: '📱',
  },
  {
    title: 'Production Reliability',
    desc: 'Render + Vercel + Supabase + n8n — proven stack, zero gimmicks.',
    icon: '⚡',
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export const ValueGrid = () => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Built for Real Business Impact
          </h2>
          <p className="text-stone text-lg">
            Enterprise-grade voice AI infrastructure that delivers measurable results
            for your business.
          </p>
        </motion.div>

        {/* Value Props Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {valueProps.map((prop, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="group relative bg-navy-700/50 rounded-lg p-8 border-t border-gold/30 hover:border-gold transition-colors duration-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                <span className="text-2xl">{prop.icon}</span>
              </div>

              {/* Content */}
              <h3 className="font-serif text-2xl text-gold-soft mb-4">
                {prop.title}
              </h3>
              <p className="text-stone">{prop.desc}</p>

              {/* Hover effect */}
              <div className="absolute inset-0 border border-gold/0 rounded-lg group-hover:border-gold/20 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
