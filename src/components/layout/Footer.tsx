import { Link } from 'react-router-dom'

const companyLinks = [
  { name: 'About', path: '/about' },
  { name: 'Careers', path: '/careers' },
  { name: 'Contact', path: '/contact' },
]

const legalLinks = [
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms of Service', path: '/terms' },
]

export const Footer = () => {
  return (
    <footer className="bg-navy-900">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <img src="/assets/brand/logo.svg" alt="ODIADEV" className="h-8 mb-6" />
            <p className="text-stone text-sm max-w-xs">
              Voice AI infrastructure that powers WhatsApp, Telegram and Web agents — fast,
              reliable, and truly Nigerian-built.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-gold-soft font-serif text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-stone hover:text-gold-soft transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-gold-soft font-serif text-lg mb-4">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-stone hover:text-gold-soft transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gold-soft font-serif text-lg mb-4">Connect</h4>
            <a
              href="https://www.linkedin.com/company/odiadev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone hover:text-gold-soft transition-colors text-sm inline-block mb-4"
            >
              LinkedIn
            </a>
            <p className="text-stone text-sm">
              Email: support.odiadev@outlook.com
              <br />
              WhatsApp: +234 810 578 6326
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-16 pt-8 border-t border-navy-700">
          <p className="text-stone text-sm">
            © {new Date().getFullYear()} ODIADEV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
