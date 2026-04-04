import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedSection } from '../components/Animations/AnimatedSection';
import { TextReveal } from '../components/Animations/TextReveal';
import { MagneticButton } from '../components/Animations/MagneticButton';
import { portfolioData } from '../data/portfolio';
import { Mail, Phone, MapPin, Send, CheckCircle, Code2, Link2 as Linkedin, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (replace with actual backend or service)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="py-20 text-center">
          <AnimatedSection>
            <span className="text-cyan-400 font-mono text-sm tracking-widest mb-4 block">
              GET IN TOUCH
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <TextReveal type="char">Contact</TextReveal>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have a project in mind or just want to say hello? I'd love to hear from you.
            </p>
          </AnimatedSection>
        </section>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <AnimatedSection fadeUp delay={0.2}>
            <div className="space-y-8">
              <div className="glass-card p-8 border-white/10 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-8 gradient-text">
                    Let's Connect
                  </h2>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Whether you have a question about my work, want to collaborate,
                    or just want to chat about technology, I'm always open to new
                    conversations.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <motion.a
                  href={`mailto:${portfolioData.social.email}`}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center flex-shrink-0 group-hover:from-cyan-500/30 group-hover:to-cyan-600/30 transition-colors">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                      {portfolioData.social.email}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 ml-auto transition-colors" />
                </motion.a>

                {/* Phone */}
                <motion.a
                  href={`tel:${portfolioData.social.phone}`}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 group-hover:from-purple-500/30 group-hover:to-purple-600/30 transition-colors">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                      {portfolioData.social.phone}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 ml-auto transition-colors" />
                </motion.a>

                {/* Location */}
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500/20 to-pink-600/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Location</p>
                    <p className="text-white font-medium">India</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass-card p-8 border-white/10">
                <h3 className="text-xl font-bold mb-6">Social Profiles</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.a
                    href={`https://github.com/${portfolioData.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all flex flex-col items-center gap-3 group"
                  >
                    <Code2 className="w-8 h-8 text-gray-400 group-hover:text-cyan-400" />
                    <span className="text-gray-300 text-sm font-medium">GitHub</span>
                  </motion.a>
                  <motion.a
                    href={`https://linkedin.com/in/${portfolioData.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 transition-all flex flex-col items-center gap-3 group"
                  >
                    <Linkedin className="w-8 h-8 text-gray-400 group-hover:text-purple-400" />
                    <span className="text-gray-300 text-sm font-medium">LinkedIn</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection fadeUp delay={0.4}>
            <div className="glass-card p-8 md:p-12 border-cyan-500/30 relative overflow-hidden">
              {/* Background glow */}
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Send a Message</h2>
                <p className="text-gray-400 mb-8">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none placeholder-gray-500 text-white"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none placeholder-gray-500 text-white"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none placeholder-gray-500 text-white"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project or just say hi..."
                      rows={6}
                      className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none placeholder-gray-500 text-white resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <MagneticButton
                    type="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="submitting"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </motion.div>
                      ) : isSubmitted ? (
                        <motion.div
                          key="submitted"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Message Sent!
                        </motion.div>
                      ) : (
                        <motion.div
                          key="submit"
                          className="flex items-center gap-3"
                        >
                          <Send className="w-5 h-5" />
                          Send Message
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </MagneticButton>
                </form>

                <p className="text-gray-500 text-sm text-center mt-6">
                  Or email me directly at:{' '}
                  <a
                    href={`mailto:${portfolioData.social.email}`}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {portfolioData.social.email}
                  </a>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
