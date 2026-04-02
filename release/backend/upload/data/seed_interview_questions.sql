-- Seed data for interview questions
-- Run this after install.sql to populate with sample questions

INSERT INTO interview_questions (id, industry, role, difficulty, question, category, expected_answer, tips) VALUES
-- Technical questions
('tech-1', 'technology', 'developer', 'medium', 'Explain the difference between var, let, and const in JavaScript.', 'technical', 'var is function-scoped and can be hoisted. let and const are block-scoped. const cannot be reassigned.', ['Focus on scope, hoisting, and reassignment', 'Mention TDZ (Temporal Dead Zone) for let/const', 'Explain when to use each']),
('tech-2', 'technology', 'developer', 'easy', 'What is a RESTful API?', 'technical', 'REST is an architectural style that uses HTTP methods to perform operations on resources identified by URLs.', ['Understand HTTP methods (GET, POST, PUT, DELETE)', 'Know about statelessness', 'Explain resources and endpoints']),
('tech-3', 'technology', 'developer', 'hard', 'Explain how a relational database works internally.', 'technical', 'Relational databases use tables with rows and columns. They enforce ACID properties and use indexes for fast lookups. Data is stored on disk with B-trees for indexing.', ['Know about normalization', 'Understand indexes and their tradeoffs', 'Mention transactions and locking']),

-- Behavioral questions
('behav-1', 'technology', NULL, 'medium', 'Tell me about a time you had a conflict with a coworker.', 'behavioral', 'Use STAR method: Describe the Situation, Task, Action you took, and Result.', ['Be honest but show resolution', 'Focus on communication', 'Show what you learned']),
('behav-2', 'technology', NULL, 'easy', 'What is your greatest professional achievement?', 'behavioral', 'Pick an achievement that demonstrates skills relevant to the job. Quantify results when possible.', 'Use numbers and metrics', 'Relate to the job you\'re applying for'),
('behav-3', 'technology', NULL, 'hard', 'Describe a situation where you failed and how you handled it.', 'behavioral', 'Own your mistake, explain what you learned, and how you prevented it from happening again.', 'Show vulnerability and growth', 'Demonstrate accountability']),

-- Situational questions
('situ-1', 'technology', 'developer', 'medium', 'What would you do if you discovered a critical bug in production right before a major release?', 'situational', 'Assess impact, communicate with stakeholders, decide on rollback vs hotfix, and ensure proper testing before deployment.', ['Communication is key', 'Prioritize user impact', 'Follow incident response procedures']),
('situ-2', 'technology', 'developer', 'easy', 'How would you handle a situation where your manager asks you to do something you disagree with?', 'situational', 'Discuss concerns respectfully, provide alternative solutions, but ultimately respect the decision if it stands.', 'Show professionalism', 'Focus on results, not ego']),

-- Experience questions
('exp-1', 'technology', 'developer', 'medium', 'Walk me through your most challenging project.', 'experience', 'Describe a complex project: your role, challenges faced, how you overcame them, and the outcome.', 'Prepare a specific example', 'Highlight problem-solving skills', 'Quantify success']),

-- Culture questions
('cult-1', 'technology', NULL, 'easy', 'What kind of work environment do you thrive in?', 'culture', 'Describe an environment that matches the company culture. Be honest but adaptable.', 'Research the company culture first', 'Be positive about past experiences']),

-- More industry-specific
('mkt-1', 'marketing', NULL, 'medium', 'How do you measure the success of a marketing campaign?', 'technical', 'Key metrics include ROI, conversion rates, CAC, LTV, engagement rates, and brand awareness metrics.', 'Know both quantitative and qualitative metrics', 'Mention attribution models']),
('mkt-2', 'marketing', NULL, 'hard', 'Explain how you would develop a content strategy for a new product launch.', 'technical', 'Define target audience, set goals, choose channels, create content pillars, establish measurement framework, and iterate based on data.', 'Show strategic thinking', 'Include distribution plan', 'Mention SEO and analytics']),

-- Business/Finance
('biz-1', 'business', NULL, 'medium', 'How do you prioritize competing projects with tight deadlines?', 'situational', 'Use prioritization frameworks (RICE, Eisenhower), communicate with stakeholders, focus on business impact, negotiate timelines.', 'Demonstrate systematic approach', 'Show communication skills']),
('biz-2', 'business', 'product manager', 'hard', 'How would you decide whether to build a feature in-house or buy a third-party solution?', 'technical', 'Consider cost, time-to-market, maintenance burden, scalability, security, and core vs non-core differentiators.', 'Total cost of ownership analysis', 'Strategic alignment assessment']),

-- Design/UX
('design-1', 'design', NULL, 'medium', 'Describe your design process from research to delivery.', 'experience', 'User research > personas > wireframes > prototypes > usability testing > final designs > development handoff > iteration.', 'Show user-centered approach', 'Mention collaboration with devs']),

-- Add more as needed
-- This is a starter set - you can add hundreds more
