import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Globe, Clock } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

// Contact info card
function ContactInfoCard({
  icon: Icon,
  title,
  value,
  href,
  color,
  index
}: {
  icon: any;
  title: string;
  value: string;
  href?: string;
  color: 'gold' | 'violet' | 'pink';
  index: number;
}) {
  const colorClasses = {
    gold: 'from-gold-500/20 to-gold-600/20 border-gold-500/20 text-gold-400',
    violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/20 text-violet-400',
    pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/20 text-pink-400',
  };

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-glass p-6 border-white/10 hover:shadow-lg hover:shadow-gold-500/10 transition-all group"
      role="group"
      aria-label={`${title}: ${value}`}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{value}</p>
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${title}: ${value} (opens in new tab)`}
      >
        {content}
      </a>
    );
  }

  return content;
}

// Map placeholder component
function MapPlaceholder() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="card-glass h-full min-h-[400px] flex items-center justify-center relative overflow-hidden"
      aria-label="Map showing our global presence with team members across India, USA, Europe, and Asia"
      role="img"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-violet-500/5 to-pink-500/5" />
      <div className="relative z-10 text-center p-8">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500/20 to-violet-500/20 flex items-center justify-center">
          <Globe className="w-12 h-12 text-gold-400" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Global Presence</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          Operating remotely with team members across 5 continents.
          Available for collaboration worldwide.
        </p>
        <div className="mt-6 flex justify-center gap-4" role="list" aria-label="Countries we operate in">
          {['🌍 India', '🌎 USA', '🌏 Europe', '🌏 Asia'].map((location) => (
            <span key={location} className="text-2xl" role="listitem" title={location.replace(/[🌍🌎🌏] /, '')}>
              {location}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function ContactPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
      <div className="absolute inset-0 bg-mesh-gradient opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-mono tracking-wider mb-6">
              <Mail className="w-4 h-4" />
              GET IN TOUCH
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
              <span className="block text-white">Let's</span>
              <span className="block text-gold-gradient">Connect</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Have a project in mind, questions about our services, or just want to say hello?
              We'd love to hear from you.
            </p>
          </motion.div>
        </section>

        <div className="max-w-4xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="card-glass p-10 border-gold-500/20 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-gold-500/20 to-violet-500/20 rounded-full blur-3xl opacity-40 animate-pulse" />
              <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gradient-to-tr from-violet-500/20 to-gold-500/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '3s' }} />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  We're here to help and answer any questions you might have.
                  Reach out and let's start a conversation.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <ContactInfoCard
                    icon={Mail}
                    title="Email Us"
                    value={portfolioData.social.email}
                    href={`mailto:${portfolioData.social.email}`}
                    color="gold"
                    index={0}
                  />
                  <ContactInfoCard
                    icon={Phone}
                    title="Call Us"
                    value={portfolioData.social.phone}
                    href={`tel:${portfolioData.social.phone}`}
                    color="violet"
                    index={1}
                  />
                  <ContactInfoCard
                    icon={MapPin}
                    title="Location"
                    value="Remote • Worldwide"
                    color="pink"
                    index={2}
                  />
                  <ContactInfoCard
                    icon={Clock}
                    title="Response Time"
                    value="Usually within 24 hours"
                    color="gold"
                    index={3}
                  />
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <MapPlaceholder />

            {/* Social Links - GitHub & Portfolio */}
            <div className="text-center py-8">
              <p className="text-gray-400 mb-6">Find me on:</p>
              <div className="flex justify-center gap-8">
                <motion.a
                  href={`https://github.com/${portfolioData.social.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-gold-400 hover:text-gold-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-black rounded px-3 py-2"
                  aria-label="Visit my GitHub profile (opens in new tab)"
                >
                  GitHub
                </motion.a>
                <motion.a
                  href="https://cardzey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-violet-400 hover:text-violet-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-black rounded px-3 py-2"
                  aria-label="Visit my portfolio (opens in new tab)"
                >
                  Portfolio
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
