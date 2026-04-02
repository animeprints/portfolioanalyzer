import { motion } from 'framer-motion';
import { Check, X, Zap } from 'lucide-react';
import NeonButton from '../UI/NeonButton';

const features = [
  { name: 'CV Analysis', free: true, pro: true, enterprise: true },
  { name: 'Skill Extraction', free: true, pro: true, enterprise: true },
  { name: 'ATS Score', free: true, pro: true, enterprise: true },
  { name: 'Job Matching', free: false, pro: true, enterprise: true },
  { name: 'PDF Export', free: '5 reports', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'API Access', free: false, pro: true, enterprise: true },
  { name: 'Custom Integrations', free: false, pro: false, enterprise: true },
  { name: 'Priority Support', free: false, pro: false, enterprise: true },
  { name: 'White-label Reports', free: false, pro: false, enterprise: true },
];

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out',
    buttonText: 'Get Started',
    variant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professionals and career coaches',
    buttonText: 'Start Free Trial',
    variant: 'primary' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams and organizations',
    buttonText: 'Contact Sales',
    variant: 'secondary' as const,
    popular: false,
  },
];

export default function PricingTable() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl text-gray-400">
            Choose the plan that fits your needs. All plans include our core AI analysis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, tierIndex) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: tierIndex * 0.1 }}
              className={`relative glass-card p-8 ${
                tier.popular
                  ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20 scale-105'
                  : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium">
                  <Zap className="w-4 h-4" />
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-gray-400">{tier.period}</span>
                  )}
                </div>
                <p className="text-gray-400 mt-2 text-sm">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {features.map((feature) => {
                  const value = feature[tier.name.toLowerCase() as keyof typeof feature];

                  return (
                    <li key={feature.name} className="flex items-start gap-3">
                      {value === false ? (
                        <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          typeof value === 'string' ? 'text-cyan-400' : 'text-green-400'
                        }`} />
                      )}
                      <span className="text-gray-300 text-sm">
                        {feature.name}
                        {typeof value === 'string' && (
                          <span className="text-gray-400"> — {value}</span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <NeonButton
                variant={tier.variant}
                size="lg"
                className="w-full"
              >
                {tier.buttonText}
              </NeonButton>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
