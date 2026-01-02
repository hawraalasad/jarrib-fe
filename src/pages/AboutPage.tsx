import { Link } from 'react-router-dom';
import { Search, MessageCircle, Star, Mail, Instagram } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-soft-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-light-lavender to-soft-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-deep-violet mb-4">
            About Jarrib
          </h1>
          <p className="font-ui text-lavender text-lg">
            Helping you discover what Kuwait has to offer
          </p>
        </div>
      </section>

      {/* What is Jarrib */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-2xl font-semibold text-deep-violet mb-6">
            What is Jarrib?
          </h2>
          <div className="font-display text-deep-violet leading-relaxed space-y-4">
            <p>
              Jarrib is a discovery platform for classes and experiences in Kuwait. We help
              you find pottery workshops, yoga classes, cooking courses, music lessons, and
              more — all in one place.
            </p>
            <p>
              We believe life is richer when you keep trying new things. Whether you want
              to learn a skill, meet new people, or just have fun, there's something for
              you.
            </p>
            <p>
              The name "Jarrib" (جرّب) means "Try it" in Arabic — and that's exactly what
              we hope you'll do.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-light-lavender">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-2xl font-semibold text-deep-violet text-center mb-12">
            How Jarrib Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <Search className="w-8 h-8 text-indigo" />
              </div>
              <h3 className="font-display font-semibold text-deep-violet text-lg mb-2">
                1. Browse
              </h3>
              <p className="font-ui text-lavender">
                Search and filter classes by category, location, price, and schedule.
                Find exactly what you're looking for.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <MessageCircle className="w-8 h-8 text-indigo" />
              </div>
              <h3 className="font-display font-semibold text-deep-violet text-lg mb-2">
                2. Connect
              </h3>
              <p className="font-ui text-lavender">
                Contact providers directly via WhatsApp. Ask questions, check
                availability, and sign up.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl flex items-center justify-center shadow-md">
                <Star className="w-8 h-8 text-indigo" />
              </div>
              <h3 className="font-display font-semibold text-deep-violet text-lg mb-2">
                3. Try
              </h3>
              <p className="font-ui text-lavender">
                Show up, have fun, and learn something new. That's it!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Providers */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display text-2xl font-semibold text-deep-violet mb-6">
            For Providers
          </h2>
          <div className="font-display text-deep-violet leading-relaxed space-y-4">
            <p>
              Do you teach a class or run workshops? List on Jarrib for free and reach
              people actively looking for new experiences.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Free to list — no hidden fees</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>Direct contact with interested students</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-success">✓</span>
                <span>No commission on bookings</span>
              </li>
            </ul>
          </div>
          <Link to="/add-listing" className="btn-primary inline-block mt-8">
            Add Your Class
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-light-lavender">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-semibold text-deep-violet mb-4">
            Questions?
          </h2>
          <p className="font-ui text-lavender mb-8">
            We'd love to hear from you — feedback, suggestions, or just to say hi.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <a
              href="mailto:hello@jarrib.kw"
              className="flex items-center gap-2 text-indigo hover:underline font-ui"
            >
              <Mail className="w-5 h-5" />
              hello@jarrib.kw
            </a>
            <a
              href="https://instagram.com/jarrib"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo hover:underline font-ui"
            >
              <Instagram className="w-5 h-5" />
              @jarrib
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
