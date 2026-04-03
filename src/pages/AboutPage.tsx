import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedSection } from '../components/Animations/AnimatedSection';
import { TextReveal } from '../components/Animations/TextReveal';
import { portfolioData } from '../data/portfolio';

// Counting animation hook
function useCountUp(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return { count, ref };
}

// Skill Bar Component
function SkillBar({ skill, delay }: { skill: { name: string; level: number }; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-gray-300 font-medium">{skill.name}</span>
        <span className="text-cyan-400 font-mono">{isInView ? `${skill.level}%` : '0%'}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut', delay }}
        />
      </div>
    </div>
  );
}

// Timeline Item Component
function TimelineItem({
  item,
  index,
  align,
}: {
  item: typeof portfolioData.experience[0];
  index: number;
  align: 'left' | 'right';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative ${align === 'left' ? 'pl-8 md:pl-0 md:pr-8 md:text-left' : 'pr-8 md:pr-0 md:pl-8 md:text-right'} md:w-1/2 ${align === 'left' ? 'md:mr-auto' : 'md:ml-auto'}`}
    >
      {/* Timeline dot */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 border-4 border-dark-950 z-10 hidden md:block" />

      <div className="glass-card p-6 border-white/10">
        <span className="text-cyan-400 font-mono text-sm mb-2 block">
          {item.period}
        </span>
        <h3 className="text-xl font-bold text-white mb-2">{item.role}</h3>
        <p className="text-purple-400 font-medium mb-3">{item.company}</p>
        <p className="text-gray-400 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const bioRef = useRef(null);
  const skillsRef = useRef(null);
  const timelineRef = useRef(null);

  // Stats count-up animations
  const stats = portfolioData.stats.map((stat) => ({
    ...stat,
    ...useCountUp(stat.value, 2),
  }));

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section ref={bioRef} className="py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection fadeUp>
              <div>
                <span className="text-cyan-400 font-mono text-sm tracking-widest mb-4 block">
                  ABOUT ME
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-8">
                  <TextReveal type="word">{`I'm ${portfolioData.name}`}</TextReveal>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  {portfolioData.bio}
                </p>
                <p className="text-gray-400 leading-relaxed">
                  {`I specialize in building immersive web experiences using cutting-edge
                   technologies like Three.js, Framer Motion, and modern React. My passion
                   lies in creating interfaces that are not only functional but also
                   delightful to interact with. I believe that great design and solid
                   engineering should coexist harmoniously.`}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection fadeUp delay={0.3}>
              <div className="glass-card p-8 border-cyan-500/30 relative overflow-hidden">
                {/* Decorative 3D-ish element */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-full blur-3xl -mr-24 -mt-24 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/30 to-purple-600/30 rounded-full blur-2xl -ml-16 -mb-16 animate-pulse-slow" />

                <div className="relative z-10 space-y-6">
                  <div className="text-center pb-6 border-b border-white/10">
                    <h3 className="text-2xl font-bold mb-2">Quick Facts</h3>
                    <p className="text-gray-400">
                      Based in India • Available for Freelance • Open to Opportunities
                    </p>
                  </div>

                  {/* Contact snippet */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-cyan-400">📧</span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white">{portfolioData.social.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400">📱</span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white">{portfolioData.social.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-pink-400">💼</span>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">GitHub</p>
                        <p className="text-white">@{portfolioData.social.github}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="relative z-10">
            <AnimatedSection>
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                By The <span className="gradient-text">Numbers</span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <AnimatedSection
                  key={index}
                  scale
                  delay={index * 0.1}
                  className="text-center"
                >
                  <div className="glass-card p-8 border-white/10">
                    <div className="text-5xl md:text-6xl font-bold gradient-text mb-2 font-mono">
                      {stat.count}
                      {stat.suffix}
                    </div>
                    <p className="text-gray-400 font-medium">{stat.label}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section ref={skillsRef} className="py-20">
          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-mono text-sm tracking-widest mb-4 block">
                EXPERTISE
              </span>
              <h2 className="text-5xl md:text-6xl font-bold">
                Skills & <span className="gradient-text">Technologies</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12">
            {portfolioData.skills.map((skillGroup, groupIndex) => (
              <AnimatedSection key={groupIndex} fadeUp delay={groupIndex * 0.2}>
                <div className="glass-card p-8 border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                    {skillGroup.category}
                  </h3>
                  <div className="space-y-4">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <SkillBar
                        key={skill.name}
                        skill={skill}
                        delay={skillIndex * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section ref={timelineRef} className="py-20 relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-pink-500/50 hidden md:block" />

          <AnimatedSection>
            <div className="text-center mb-16">
              <span className="text-cyan-400 font-mono text-sm tracking-widest mb-4 block">
                JOURNEY
              </span>
              <h2 className="text-5xl md:text-6xl font-bold">
                Experience & <span className="gradient-text">Education</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="relative">
            {/* Experience */}
            <div className="space-y-8 mb-16">
              {portfolioData.experience.map((exp, index) => (
                <TimelineItem
                  key={index}
                  item={exp}
                  index={index}
                  align={index % 2 === 0 ? 'left' : 'right'}
                />
              ))}
            </div>

            {/* Education */}
            {portfolioData.education.map((edu, index) => (
              <TimelineItem
                key={index}
                item={{
                  ...edu,
                  role: edu.degree,
                  company: edu.institution,
                  period: edu.period,
                  description: edu.description,
                }}
                index={portfolioData.experience.length + index}
                align="left"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
