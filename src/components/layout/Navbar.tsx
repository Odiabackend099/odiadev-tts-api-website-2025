import { useState, useEffect } from 'react'
import { motion, useScroll } from 'framer-motion'
import { Link } from 'react-router-dom'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'What We Do', path: '/what-we-do' },
  { name: 'Voice Agents', path: '/voice-agents' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Resources', path: '/resources' },
  { name: 'Contact', path: '/contact' },
]

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50)
    })
  }, [scrollY])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled ? 'bg-navy-900/80 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/assets/brand/logo.svg" alt="ODIADEV" className="h-8" />
          </Link>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white/90 hover:text-gold-soft transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-white/90 hover:text-gold-soft transition-colors text-sm font-medium hidden lg:block"
            >
              Client Login
            </Link>
            <Link
              to="/contact"
              className="bg-gold hover:bg-gold-soft text-navy-900 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}
