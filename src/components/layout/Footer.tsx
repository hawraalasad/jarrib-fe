import { Link } from 'react-router-dom';
import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-deep-violet text-soft-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-arabic text-3xl font-semibold text-soft-white">جرّب</span>
            </Link>
            <p className="font-display text-lavender max-w-md">
              Discover classes, workshops, and experiences in Kuwait. Try something new today.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-ui font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse" className="font-ui text-lavender hover:text-soft-white transition-colors">
                  Browse Classes
                </Link>
              </li>
              <li>
                <Link to="/about" className="font-ui text-lavender hover:text-soft-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/add-listing" className="font-ui text-lavender hover:text-soft-white transition-colors">
                  For Providers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-ui font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@jarrib.kw"
                  className="font-ui text-lavender hover:text-soft-white transition-colors"
                >
                  hello@jarrib.kw
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href="https://instagram.com/jarrib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lavender hover:text-soft-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/jarrib"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lavender hover:text-soft-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-lavender/20 mt-8 pt-8 text-center">
          <p className="font-ui text-sm text-lavender">
            © {new Date().getFullYear()} Jarrib. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
