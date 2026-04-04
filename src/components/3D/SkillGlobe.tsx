import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SkillData {
  name: string;
  level: number;
  category: string;
}

interface SkillGlobeProps {
  skills: SkillData[];
  size?: number;
  onSkillClick?: (skill: string, level: number) => void;
}

// Category colors matching the design system
const categoryColors: Record<string, string> = {
  technical: '#2563EB',    // Primary blue
  soft: '#3B82F6',         // Secondary blue
  business: '#F97316',     // CTA orange
  languages: '#10B981',    // Green
  tools: '#8B5CF6',        // Purple
  frontend: '#2563EB',
  backend: '#F97316',
  devops: '#8B5CF6',
  creative: '#EC4899',
};

export default function SkillGlobe({ skills, size = 3, onSkillClick }: SkillGlobeProps) {
  // Group skills by category for radial chart
  const groupedSkills = useMemo(() => {
    const groups: Record<string, typeof skills> = {};
    skills.forEach(skill => {
      const category = skill.category.toLowerCase();
      if (!groups[category]) groups[category] = [];
      groups[category].push(skill);
    });
    return groups;
  }, [skills]);

  const categories = Object.keys(groupedSkills);
  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Center circle with average score */}
      <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
        <div className="text-center">
          <div className="text-4xl font-bold text-white">
            {skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length) : 0}%
          </div>
          <div className="text-white/80 text-sm">Avg</div>
        </div>
      </div>

      {/* Radial skill bars */}
      <svg viewBox="0 0 300 300" className="w-full h-full max-w-[300px] max-h-[300px]">
        {categories.map((category, catIndex) => {
          const catSkills = groupedSkills[category];
          const anglePerSkill = (Math.PI * 2) / Math.max(categories.length, 1);
          const startAngle = -Math.PI / 2 + catIndex * anglePerSkill * 0.8;
          const color = categoryColors[category.toLowerCase()] || '#6B7280';

          return (
            <g key={category}>
              {catSkills.map((skill, skillIndex) => {
                const skillAngle = startAngle + (skillIndex / Math.max(catSkills.length, 1)) * anglePerSkill * 0.7;
                const innerRadius = radius * 0.4;
                const outerRadius = radius * 0.4 + (skill.level / 100) * radius * 0.5;
                const x1 = centerX + Math.cos(skillAngle) * innerRadius;
                const y1 = centerY + Math.sin(skillAngle) * innerRadius;
                const x2 = centerX + Math.cos(skillAngle) * outerRadius;
                const y2 = centerY + Math.sin(skillAngle) * outerRadius;

                return (
                  <g key={skill.name}>
                    <motion.line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={color}
                      strokeWidth={3}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 1, delay: catIndex * 0.1 + skillIndex * 0.05 }}
                      className="cursor-pointer hover:stroke-white"
                      onClick={() => onSkillClick?.(skill.name, skill.level)}
                    />
                    {/* Skill label */}
                    <motion.text
                      x={x2 + 10}
                      y={y2}
                      fill="white"
                      fontSize="10"
                      textAnchor="start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="pointer-events-none select-none"
                    >
                      {skill.name}
                    </motion.text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
