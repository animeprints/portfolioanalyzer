import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Play,
  Pause,
  CheckCircle,
  ChevronRight,
  Trophy,
  Clock,
  Target,
  Zap,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
  RefreshCw,
  ArrowRight,
  Timer,
} from 'lucide-react';

interface Question {
  id: string;
  category: string;
  question: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  exampleAnswer?: string;
}

const mockQuestions: Question[] = [
  {
    id: '1',
    category: 'Technical',
    question: 'Explain the concept of closures in JavaScript and provide a practical use case.',
    tips: [
      'Define lexical scoping',
      'Explain how functions retain access to outer scope',
      'Provide example of data encapsulation or factory functions',
      'Discuss memory implications',
    ],
    difficulty: 'medium',
    exampleAnswer: 'A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has returned...',
  },
  {
    id: '2',
    category: 'Behavioral',
    question: 'Tell me about a time you had to solve a difficult problem with limited resources.',
    tips: [
      'Use STAR method (Situation, Task, Action, Result)',
      'Quantify the impact of your solution',
      'Highlight collaboration and resourcefulness',
      'Share lessons learned',
    ],
    difficulty: 'medium',
    exampleAnswer: 'In my previous role, our team faced a critical deadline with only two developers available...',
  },
  {
    id: '3',
    category: 'System Design',
    question: 'How would you design a URL shortening service like bit.ly?',
    tips: [
      'Start with clarifying requirements and scale',
      'Discuss hash generation strategies (Base62, etc.)',
      'Address database design and indexing',
      'Consider caching, CDN, and analytics',
      'Handle collisions and custom URLs',
    ],
    difficulty: 'hard',
    exampleAnswer: 'First, I would clarify functional requirements: we need to create short URLs, redirect, and optionally track analytics...',
  },
  {
    id: '4',
    category: 'Technical',
    question: 'What is the difference between SQL and NoSQL databases? When would you use each?',
    tips: [
      'Compare data models (relational vs. document/column/graph)',
      'Discuss ACID vs BASE properties',
      'Consider scalability approach (vertical vs horizontal)',
      'Mention specific use cases for each',
    ],
    difficulty: 'easy',
    exampleAnswer: 'SQL databases are relational and table-based, ideal for structured data with complex queries...',
  },
  {
    id: '5',
    category: 'Behavioral',
    question: 'Describe a situation where you had to work with a difficult team member.',
    tips: [
      'Focus on professional communication',
      'Show empathy and perspective-taking',
      'Explain conflict resolution process',
      'Highlight positive outcome',
    ],
    difficulty: 'easy',
  },
  {
    id: '6',
    category: 'Technical',
    question: 'Explain the event loop in Node.js and how it handles asynchronous operations.',
    tips: [
      'Describe single-threaded nature',
      'Explain callbacks, promises, async/await',
      'Discuss event loop phases',
      'Mention microtasks vs macrotasks',
    ],
    difficulty: 'medium',
  },
  {
    id: '7',
    category: 'System Design',
    question: 'Design a real-time chat application supporting millions of concurrent users.',
    tips: [
      'Clarify requirements (1:1, group chat, features)',
      'Choose WebSocket for real-time communication',
      'Design message storage and retrieval',
      'Handle presence and online status',
      'Consider scaling and sharding strategies',
    ],
    difficulty: 'hard',
  },
  {
    id: '8',
    category: 'Behavioral',
    question: 'How do you handle feedback or criticism about your work?',
    tips: [
      'Show openness and growth mindset',
      'Provide specific example',
      'Explain how you act on feedback',
      'Demonstrate emotional intelligence',
    ],
    difficulty: 'easy',
  },
];

const categories = ['All', 'Technical', 'Behavioral', 'System Design'];

const difficultyColors = {
  easy: 'border-green-500/30 text-green-400 bg-green-500/10',
  medium: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
  hard: 'border-red-500/30 text-red-400 bg-red-500/10',
};

const categoryColors: Record<string, string> = {
  'Technical': 'from-cyan-500/20 to-blue-600/20 border-cyan-500/20 text-cyan-400',
  'Behavioral': 'from-pink-500/20 to-rose-600/20 border-pink-500/20 text-pink-400',
  'System Design': 'from-violet-500/20 to-purple-600/20 border-violet-500/20 text-violet-400',
  'All': 'from-gold-500/20 to-amber-600/20 border-gold-500/20 text-gold-400',
};

// Timer component
function TimerDisplay({ seconds }: { seconds: number }) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = (seconds / 300) * 100; // 5 min max

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <motion.path
            d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="3"
            strokeDasharray={`${progress}, 100`}
            initial={{ strokeDasharray: '0, 100' }}
            animate={{ strokeDasharray: `${progress}, 100` }}
            transition={{ duration: 0.5 }}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#9333ea" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Timer className="w-5 h-5 text-gold-400" />
        </div>
      </div>
      <span className="text-2xl font-mono text-gold-400 font-bold">
        {minutes.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

// Progress stats
function ProgressStats({ practices }: { practices: any[] }) {
  const totalTime = practices.reduce((acc, p) => acc + p.duration, 0);
  const avgTime = practices.length > 0 ? Math.floor(totalTime / practices.length) : 0;
  const categoriesPracticed = new Set(practices.map(p => p.category)).size;

  const stats = [
    { label: 'Sessions', value: practices.length, icon: Calendar },
    { label: 'Total Time', value: `${Math.floor(totalTime / 60)}m`, icon: Clock },
    { label: 'Avg Session', value: `${Math.floor(avgTime / 60)}:${(avgTime % 60).toString().padStart(2, '0')}`, icon: Timer },
    { label: 'Categories', value: categoriesPracticed, icon: Target },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="card-glass p-4 text-center border-white/5"
        >
          <stat.icon className="w-5 h-5 text-gold-400 mx-auto mb-2" />
          <div className="text-2xl font-mono font-bold text-white">{stat.value}</div>
          <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export default function InterviewPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [practices, setPractices] = useState<any[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef(null);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'All') return mockQuestions;
    return mockQuestions.filter((q) => q.category === selectedCategory);
  }, [selectedCategory]);

  // Timer effect
  useEffect(() => {
    if (isPracticing) {
      timerRef.current = setInterval(() => {
        setTimeElapsed((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPracticing]);

  const startPractice = (question: Question) => {
    setCurrentQuestion(question);
    setTimeElapsed(0);
    setIsPracticing(true);
    setShowAnswer(false);
  };

  const endPractice = () => {
    setIsPracticing(false);
    const practice = {
      questionId: currentQuestion?.id,
      category: currentQuestion?.category,
      difficulty: currentQuestion?.difficulty,
      duration: timeElapsed,
      date: new Date().toISOString(),
    };
    setPractices([...practices, practice]);
  };

  const resetSession = () => {
    setCurrentQuestion(null);
    setIsPracticing(false);
    setTimeElapsed(0);
    setShowAnswer(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryStats = () => {
    return categories.filter(c => c !== 'All').map(cat => ({
      category: cat,
      count: mockQuestions.filter(q => q.category === cat).length,
      practiced: practices.filter(p => p.category === cat).length,
    }));
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,165,116,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_40%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-orange-500/20 border border-pink-500/30 mb-6">
            <MessageSquare className="w-4 h-4 text-pink-400" />
            <span className="text-pink-400 text-sm font-mono tracking-wider">INTERVIEW PREP</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6">
            <span className="block text-white">Master Your</span>
            <span className="block bg-gradient-to-r from-pink-500 via-gold-500 to-orange-500 bg-clip-text text-transparent">
              Interview Skills
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Practice with realistic interview questions, track your progress, and build confidence with personalized feedback.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left panel - Question list */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === cat
                      ? `bg-gradient-to-r ${categoryColors[cat].split(' ')[0]} ${categoryColors[cat].split(' ')[1]} text-white shadow-lg`
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-gold-400/50 hover:text-white'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>

            {/* Question cards */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredQuestions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`card-glass p-5 cursor-pointer transition-all group ${
                    currentQuestion?.id === q.id
                      ? 'border-pink-400/50 ring-2 ring-pink-400/20 bg-pink-500/5'
                      : 'hover:border-gold-400/30'
                  }`}
                  onClick={() => !isPracticing && startPractice(q)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold border ${difficultyColors[q.difficulty]} flex-shrink-0`}>
                      {q.difficulty.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-sm line-clamp-2 group-hover:text-pink-400 transition-colors">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-0.5 rounded ${categoryColors[q.category].split(' ')[2]} ${categoryColors[q.category].split(' ')[3]}`}>
                          {q.category}
                        </span>
                        <span>{q.tips.length} tips</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-5 text-gray-600 group-hover:text-pink-400 mt-1 flex-shrink-0 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Practice history */}
            {practices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card-glass p-6 border-white/10"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gold-400">
                  <Trophy className="w-5 h-5" />
                  Recent Sessions
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {practices.slice(-5).reverse().map((practice, i) => {
                    const q = mockQuestions.find((q) => q.id === practice.questionId);
                    return (
                      <div key={i} className="flex items-center justify-between text-sm p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3 min-w-0">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300 truncate">{q?.question.slice(0, 50)}...</span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[q?.category || ''].split(' ')[2]} ${categoryColors[q?.category || ''].split(' ')[3]}`}>
                            {q?.category}
                          </span>
                          <span className="text-gray-500 font-mono text-xs">{formatTime(practice.duration)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right panel - Practice area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Welcome state */}
              {!currentQuestion && !isPracticing && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card-glass min-h-[600px] flex flex-col items-center justify-center border-gold-500/20 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-violet-500/5 to-pink-500/5" />

                  <div className="relative z-10 text-center p-12">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold-500/30 to-pink-500/30 flex items-center justify-center border-2 border-gold-500/30"
                    >
                      <Sparkles className="w-16 h-16 text-gold-400" />
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-4 text-white">Ready to Practice?</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-10 leading-relaxed">
                      Select a question from the list to start a practice session.
                      Track your time and review tips to improve your answers.
                    </p>

                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                      {[
                        { icon: Timer, title: 'Time Yourself', desc: 'Practice under time pressure' },
                        { icon: Target, title: 'Track Progress', desc: 'Monitor improvement over time' },
                        { icon: Award, title: 'Review Tips', desc: 'Learn best practices' },
                        { icon: BarChart3, title: 'View Stats', desc: 'Analyze your performance' },
                      ].map((feature, i) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold-400/30 transition-all group"
                        >
                          <feature.icon className="w-6 h-6 text-gold-400 mb-2 group-hover:scale-110 transition-transform" />
                          <div className="font-semibold text-white text-sm">{feature.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{feature.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Practice mode */}
              {currentQuestion && isPracticing && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card-glass border-2 border-pink-500/30 overflow-hidden"
                >
                  {/* Timer bar */}
                  <div className="h-1 bg-white/10 relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 via-gold-500 to-orange-500"
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 300, ease: 'linear' }}
                    />
                  </div>

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${difficultyColors[currentQuestion.difficulty]}`}>
                          {currentQuestion.difficulty.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${categoryColors[currentQuestion.category].split(' ')[2]} ${categoryColors[currentQuestion.category].split(' ')[3]}`}>
                          {currentQuestion.category}
                        </span>
                      </div>
                      <TimerDisplay seconds={timeElapsed} />
                    </div>

                    {/* Question */}
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-white leading-relaxed mb-8">
                        {currentQuestion.question}
                      </h2>

                      <div className="p-6 rounded-2xl bg-gradient-to-r from-pink-900/30 to-violet-900/30 border border-pink-500/20">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-pink-400">
                          <Zap className="w-5 h-5" />
                          Key Points to Cover
                        </h3>
                        <ul className="space-y-3">
                          {currentQuestion.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-200">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-gold-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <motion.button
                        onClick={endPractice}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold text-white shadow-lg shadow-green-500/20 flex items-center justify-center gap-3"
                      >
                        <CheckCircle className="w-6 h-6" />
                        Complete Practice
                      </motion.button>
                      <motion.button
                        onClick={resetSession}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-5 bg-white/10 border border-white/20 rounded-xl font-semibold text-gray-300 hover:bg-white/20 transition-all"
                      >
                        Skip
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Question detail view */}
              {currentQuestion && !isPracticing && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card-glass border-cyan-500/20 p-0 overflow-hidden"
                >
                  <div className="p-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${categoryColors[currentQuestion.category].split(' ')[2]} ${categoryColors[currentQuestion.category].split(' ')[3]}`}>
                          {currentQuestion.category}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${difficultyColors[currentQuestion.difficulty]}`}>
                          {currentQuestion.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <motion.button
                        onClick={resetSession}
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                      >
                        <ChevronRight className="w-5 h-5 rotate-45 text-gray-400" />
                      </motion.button>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-8 leading-relaxed">
                      {currentQuestion.question}
                    </h2>

                    {/* Tips section */}
                    <div className="mb-10 p-8 rounded-2xl bg-gradient-to-r from-violet-900/30 to-gold-900/30 border border-violet-500/20">
                      <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gold-400">
                        <Award className="w-6 h-6" />
                        How to Approach This Question
                      </h3>
                      <ol className="space-y-4">
                        {currentQuestion.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-4 text-gray-200">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-500 to-violet-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                              {i + 1}
                            </div>
                            <span className="pt-1">{tip}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Example answer if applicable */}
                    {currentQuestion.exampleAnswer && (
                      <div className="mb-10">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-violet-400">
                          <Sparkles className="w-5 h-5" />
                          Sample Answer Structure
                        </h3>
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-gray-300 leading-relaxed italic">
                            "{currentQuestion.exampleAnswer.slice(0, 200)}..."
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Start practice button */}
                    <motion.button
                      onClick={() => startPractice(currentQuestion)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-6 bg-gradient-to-r from-pink-500 via-gold-500 to-orange-500 rounded-xl font-bold text-white text-lg shadow-lg shadow-gold-500/30 flex items-center justify-center gap-3"
                    >
                      <Play className="w-6 h-6" />
                      Start Practice Timer
                    </motion.button>
                  </div>

                  {/* Category stats */}
                  <div className="p-6 bg-white/5 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <BarChart3 className="w-4 h-4" />
                        <span>Category Progress</span>
                      </div>
                      <span className="text-gold-400 font-medium">
                        {practices.filter(p => p.category === currentQuestion.category).length} sessions
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats sidebar */}
            {practices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 card-glass p-6 border-gold-500/20"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gold-400">
                  <BarChart3 className="w-5 h-5" />
                  Your Progress
                </h3>
                <ProgressStats practices={practices} />

                {/* Category breakdown */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">By Category</h4>
                  <div className="space-y-3">
                    {getCategoryStats().map((stat) => (
                      <div key={stat.category} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${categoryColors[stat.category].split(' ')[2].replace('bg-', '')}`} />
                          <span className="text-gray-400">{stat.category}</span>
                        </div>
                        <span className="text-white font-medium">{stat.practiced} sessions</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPractices([])}
                  className="mt-6 w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Progress
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
