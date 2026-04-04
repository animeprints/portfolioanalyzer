import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, BarChart3, FileText, Users, Shield, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Upload,
      title: 'Smart Upload',
      description: 'Upload your CV in PDF, DOCX, or TXT format. Our AI parser extracts all relevant information instantly.',
    },
    {
      icon: BarChart3,
      title: 'Deep Analysis',
      description: 'Get comprehensive scores on ATS compatibility, readability, impact, and completeness.',
    },
    {
      icon: FileText,
      title: 'Skill Extraction',
      description: 'Automatically identify technical, soft, and business skills with proficiency levels.',
    },
    {
      icon: Users,
      title: 'Job Matching',
      description: 'Match your CV against job descriptions and get personalized skill gap analysis.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is processed securely. Client-side option ensures nothing leaves your browser.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'AI-powered analysis delivers results in seconds, not minutes.',
    },
  ];

  const stats = [
    { value: '95%', label: 'Accuracy Rate' },
    { value: '10K+', label: 'CVs Analyzed' },
    { value: '4.8/5', label: 'User Rating' },
    { value: '<5s', label: 'Analysis Time' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      content: 'Cardzey helped me identify gaps in my resume. After implementing the suggestions, I landed 3 more interviews.',
      rating: 5,
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Manager',
      content: 'The job matching feature is incredibly accurate. It helped me tailor my CV for specific roles and I got hired!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Analyst',
      content: 'Finally, a CV analyzer that actually understands modern resumes. The skill extraction was spot-on.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-6 border border-primary/30">
              <Zap className="w-4 h-4" />
              AI-Powered CV Analysis
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-100 mb-6 tracking-tight">
              Unlock Your CV's
              <span className="block text-primary">Full Potential</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              Get detailed insights, skill analysis, and personalized recommendations to make your resume stand out.
              Trusted by thousands of job seekers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/analyze"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
              >
                Analyze Your CV Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-slate-100 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-colors shadow-md"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-800/50 border-y border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Comprehensive CV analysis powered by advanced AI to give you the competitive edge.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-primary/50 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">How It Works</h2>
            <p className="text-xl text-slate-400">Get your CV analyzed in three simple steps</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Upload', desc: 'Select your CV file (PDF, DOCX, or TXT) and upload it securely.' },
              { step: '2', title: 'Analyze', desc: 'Our AI processes your resume and generates detailed insights.' },
              { step: '3', title: 'Improve', desc: 'Review recommendations and optimize your CV for success.' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-100 mb-4">Loved by Job Seekers</h2>
            <div className="flex justify-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xl text-slate-400">Join thousands who landed better jobs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-slate-100">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of job seekers who have already improved their CVs and landed better interviews.
          </p>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-primary rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-lg"
          >
            Start Free Analysis
            <ArrowRight className="w-6 h-6" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Cardzey</h3>
            <p className="text-sm">AI-Powered CV Analysis for Modern Job Seekers</p>
          </div>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Sign Up</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          © 2024 Cardzey. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
