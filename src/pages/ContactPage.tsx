import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle, Code2, Link2, GitBranch, ArrowUpRight, Globe, Clock } from 'lucide-react';
import { portfolioData } from '../data/portfolio';

// Form field component
function FormField({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  rows
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  rows?: number;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const fieldId = `contact-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;

  const inputClasses = `
    w-full px-6 py-4 rounded-xl
    bg-black/40 border
    ${error
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-white/10 focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/20'
    }
    transition-all duration-300 outline-none resize-none
    text-white placeholder-gray-600
    touch-manipulation
    min-h-[44px]
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-300 mb-3 ml-1"
      >
        {label}
        {required && <span className="text-gold-500 ml-1" aria-hidden="true">*</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur(e);
          }}
          required={required}
          rows={rows || 5}
          placeholder={placeholder}
          aria-describedby={errorId}
          aria-invalid={!!error}
          className={inputClasses}
        />
      ) : (
        <input
          id={fieldId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur(e);
          }}
          required={required}
          placeholder={placeholder}
          aria-describedby={errorId}
          aria-invalid={!!error}
          className={inputClasses}
        />
      )}
      {error && (
        <motion.p
          id={errorId}
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400 flex items-center gap-2"
        >
          {error}
        </motion.p>
      )}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-gold-500 to-violet-500 mt-0 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: isFocused && !error ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Please enter your name';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Please enter your email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'subject':
        if (!value.trim()) return 'Please enter a subject';
        if (value.trim().length < 5) return 'Subject must be at least 5 characters';
        return '';
      case 'message':
        if (!value.trim()) return 'Please enter your message';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(newErrors).length > 0) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Random success (for demo)
      const success = Math.random() > 0.1;
      if (success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setTouched({});
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        throw new Error('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
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

                <div className="space-y-6">
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

            {/* Social Links */}
            <div className="card-glass p-8 border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Follow Us</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: GitBranch, label: 'GitHub', href: `https://github.com/${portfolioData.social.github}`, color: 'gray' },
                  { icon: Link2, label: 'LinkedIn', href: `https://linkedin.com/in/${portfolioData.social.linkedin}`, color: 'blue' },
                  { icon: Code2, label: 'Portfolio', href: '#', color: 'cyan' },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-400/50 transition-all group"
                    aria-label={`Follow us on ${social.label} (opens in new tab)`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      social.color === 'gold' ? 'bg-gold-500/20 text-gold-400' :
                      social.color === 'violet' ? 'bg-violet-500/20 text-violet-400' :
                      social.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      <social.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">{social.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-gold-400 ml-auto transition-colors" aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <MapPlaceholder />
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card-glass p-10 border-violet-500/20 relative overflow-hidden h-full">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full blur-3xl opacity-30" />

              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Send a Message</h2>
                  <p className="text-gray-400">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </div>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  noValidate
                  aria-label="Contact form"
                >
                  {/* Screen reader live region for status announcements */}
                  <div aria-live="polite" aria-atomic="true" className="sr-only">
                    {submitStatus === 'success' && 'Message sent successfully. We will respond within 24 hours.'}
                    {submitStatus === 'error' && 'There was an issue sending your message. Please try again.'}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      label="Your Name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.name ? errors.name : undefined}
                      required
                    />
                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.email ? errors.email : undefined}
                      required
                    />
                  </div>

                  <FormField
                    label="Subject"
                    name="subject"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.subject ? errors.subject : undefined}
                    required
                  />

                  <FormField
                    label="Message"
                    name="message"
                    placeholder="Tell us about your project, question, or just say hi..."
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.message ? errors.message : undefined}
                    required
                    rows={6}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      aria-busy={isSubmitting}
                      aria-describedby={submitStatus === 'success' ? 'form-success' : submitStatus === 'error' ? 'form-error' : undefined}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className={`w-full py-5 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                        isSubmitting
                          ? 'bg-gray-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-gold-500 to-violet-600 hover:shadow-lg hover:shadow-gold-500/30 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-black'
                      }`}
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
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Sending...</span>
                          </motion.div>
                        ) : submitStatus === 'success' ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3"
                          >
                            <CheckCircle className="w-6 h-6" />
                            <span>Message Sent Successfully!</span>
                          </motion.div>
                        ) : submitStatus === 'error' ? (
                          <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 text-red-400"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Failed to send. Please check your connection and try again.</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="send"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3"
                          >
                            <Send className="w-6 h-6" />
                            <span>Send Message</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </form>

                <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-gold-500/5 to-violet-500/5 border border-white/5">
                  <p className="text-sm text-gray-400 text-center">
                    Or email us directly at:{' '}
                    <a
                      href={`mailto:${portfolioData.social.email}`}
                      className="text-gold-400 hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-black rounded transition-colors font-medium"
                      aria-label="Email us directly"
                    >
                      {portfolioData.social.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ section */}
        <section className="py-20" aria-label="Frequently asked questions">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-violet-400 font-mono text-sm tracking-widest mb-4 block">
              FAQ
            </span>
            <h2 className="text-5xl md:text-6xl font-bold">
              Common <span className="text-gold-gradient">Questions</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What's your typical response time?",
                a: "We aim to respond within 24 hours, often within a few hours during business days."
              },
              {
                q: "Do you take on freelance projects?",
                a: "Yes! We're always interested in exciting collaborations. Drop us a line with your project details."
              },
              {
                q: "Where are you based?",
                a: "We're a fully remote team with members across 5 continents, enabling us to work with clients worldwide."
              },
              {
                q: "How can I schedule a call?",
                a: "After reaching out via email or form, we'll set up a video call at a time that works for you."
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-glass p-6 border-white/5"
              >
                <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-gray-400 leading-relaxed pl-11">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
