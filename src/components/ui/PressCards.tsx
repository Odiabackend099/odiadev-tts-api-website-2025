import { motion } from 'framer-motion'

const pressItems = [
  {
    title: 'University Deployments',
    kicker: 'ODIADEV',
    date: '2025',
    description:
      'How Nigerian universities are transforming student support with AI voice assistants.',
    image: '/assets/press/universities.jpg', // Placeholder
  },
  {
    title: 'Healthcare Assistants',
    kicker: 'Serenity Care AI',
    date: '2025',
    description:
      'Voice-enabled AI companions making healthcare more accessible and personal.',
    image: '/assets/press/healthcare.jpg', // Placeholder
  },
  {
    title: 'SME Support Bots',
    kicker: 'ODIADEV Agents',
    date: '2025',
    description:
      'Small businesses achieving 24/7 customer service with Nigerian-voice AI.',
    image: '/assets/press/sme.jpg', // Placeholder
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export const PressCards = () => {
  return (
    <section className="py-24 lg:py-32 bg-navy-900">
      <div className="container-xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Voice AI in Action
          </h2>
          <p className="text-stone text-lg max-w-2xl mx-auto">
            Discover how organizations are using ODIADEV to transform their
            operations and customer experience.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pressItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="group relative bg-navy-700/30 rounded-lg overflow-hidden"
            >
              {/* Image with overlay */}
              <div className="relative h-48 overflow-hidden">
                <motion.div
                  initial={{ scale: 1.2 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <div className="absolute inset-0 bg-gradient-overlay opacity-60 z-10" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gold text-sm font-medium">
                    {item.kicker}
                  </span>
                  <span className="text-stone text-sm">{item.date}</span>
                </div>
                <h3 className="font-serif text-2xl text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-stone mb-6">{item.description}</p>
                <button className="text-gold hover:text-gold-soft transition-colors">
                  Read more →
                </button>
              </div>

              {/* Border effect */}
              <div className="absolute inset-0 border border-gold/10 rounded-lg group-hover:border-gold/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
