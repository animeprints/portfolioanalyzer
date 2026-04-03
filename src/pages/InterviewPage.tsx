// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, CheckCircle, ChevronRight, Award, Calendar, Timer, MessageSquare, Sparkles } from 'lucide-react';

interface Question {
  id: string;
  category: string;
  question: string;
  tips: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockQuestions: Question[] = [
  {
    id: '1',
    category: 'Technical',
    question: 'Explain the concept of closures in JavaScript and provide a practical example.',
    tips: [
      'Mention lexical scoping',
      'Provide a real-world example like data encapsulation',
      'Explain memory retention',
    ],
    difficulty: 'medium',
  },
  {
    id: '2',
    category: 'Behavioral',
    question: 'Tell me about a time you had to solve a difficult problem with limited resources.',
    tips: [
      'Use STAR method (Situation, Task, Action, Result)',
      'Quantify the impact',
      'Show collaboration skills',
    ],
    difficulty: 'medium',
  },
  {
    id: '3',
    category: 'System Design',
    question: 'How would you design a URL shortening service like bit.ly?',
    tips: [
      'Consider scale from the start',
      'Discuss hash generation strategies',
      'Address caching and database design',
    ],
    difficulty: 'hard',
  },
  {
    id: '4',
    category: 'Technical',
    question: 'What is the difference between SQL and NoSQL databases? When would you use each?',
    tips: [
      'Discuss ACID vs BASE',
      'Consider scalability needs',
      'Mention specific use cases',
    ],
    difficulty: 'easy',
  },
  {
    id: '5',
    category: 'Behavioral',
    question: 'Describe a situation where you had to work with a difficult team member.',
    tips: [
      'Focus on communication',
      'Show empathy and professionalism',
      'Explain the resolution process',
    ],
    difficulty: 'easy',
  },
];

const categories = ['All', 'Technical', 'Behavioral', 'System Design'];

export default function InterviewPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [practices, setPractices] = useState<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const filteredQuestions = selectedCategory === 'All'
    ? mockQuestions
    : mockQuestions.filter((q) => q.category === selectedCategory);

  const startPractice = (question: Question) => {
    setCurrentQuestion(question);
    setTimeElapsed(0);
    setIsPracticing(true);
  };

  const endPractice = () => {
    setIsPracticing(false);
    // In a real app, you'd send answer to backend
    setPractices([
      ...practices,
      {
        questionId: currentQuestion?.id,
        duration: timeElapsed,
        date: new Date().toISOString(),
      },
    ]);
    setCurrentQuestion(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-500/30';
      case 'medium': return 'text-yellow-400 border-yellow-500/30';
      case 'hard': return 'text-red-400 border-red-500/30';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="relative min-h-screen pt-24 pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-pink-900/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-900/50 to-orange-900/50 border border-pink-500/30 mb-6">
            <MessageSquare className="w-4 h-4 text-pink-400" />
            <span className="text-pink-400 text-sm font-mono tracking-wider">INTERVIEW PREP</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="gradient-text">Master the Interview</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Practice with hundreds of real interview questions. Get AI feedback, track your progress, and build confidence.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category filters */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                      : 'bg-white/10 border border-white/20 text-gray-300 hover:border-pink-400/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>

            {/* Question cards */}
            <div className="space-y-4">
              {filteredQuestions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-6 border-white/10 cursor-pointer transition-all group ${
                    currentQuestion?.id === q.id ? 'border-pink-400/50 ring-2 ring-pink-400/20' : 'hover:border-pink-400/30'
                  }`}
                  onClick={() => !isPracticing && startPractice(q)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{q.category}</span>
                      </div>
                      <p className="text-white font-medium line-clamp-2 group-hover:text-pink-400 transition-colors">
                        {q.question}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-pink-400 mt-1 flex-shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Practice History */}
            {practices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-white/10"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Recent Sessions
                </h3>
                <div className="space-y-3">
                  {practices.slice(-5).reverse().map((practice, i) => {
                    const question = mockQuestions.find((q) => q.id === practice.questionId);
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 truncate max-w-[200px]">
                            {question?.question.slice(0, 50)}...
                          </span>
                        </div>
                        <div className="text-gray-500 font-mono text-xs">
                          {formatTime(practice.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Practice Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!isPracticing && !currentQuestion && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card h-full min-h-[600px] flex items-center justify-center border-white/10 relative overflow-hidden"
                >
                  <div className="text-center p-12">
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-900/50 to-orange-900/50 flex items-center justify-center animate-pulse">
                      <Sparkles className="w-16 h-16 text-pink-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Ready to Practice?</h2>
                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                      Select a question from the list to start your practice session.
                      You'll have time to think and then record your answer.
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-cyan-400 font-semibold mb-1">Timer Mode</div>
                        <div className="text-sm text-gray-400">Track your response time</div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-purple-400 font-semibold mb-1">Progress Track</div>
                        <div className="text-sm text-gray-400">Monitor improvement</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentQuestion && isPracticing && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card border-2 border-pink-500/30 overflow-hidden"
                >
                  {/* Timer bar */}
                  <div className="h-2 bg-white/10 relative overflow-hidden">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 300, ease: 'linear' }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-orange-500"
                    />
                  </div>

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                          {currentQuestion.difficulty}
                        </span>
                        <span className="text-gray-400 text-sm">{currentQuestion.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-2xl font-mono text-pink-400">
                        <Timer className="w-6 h-6" />
                        {formatTime(timeElapsed)}
                      </div>
                    </div>

                    {/* Question */}
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                        {currentQuestion.question}
                      </h3>

                      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-cyan-400 font-semibold mb-3">💡 Tips to consider:</h4>
                        <ul className="space-y-2">
                          {currentQuestion.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-gray-300">
                              <ChevronRight className="w-4 h-4 text-pink-400 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <button
                        onClick={endPractice}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Complete Practice
                      </button>
                      <button
                        onClick={() => {
                          setCurrentQuestion(null);
                          setIsPracticing(false);
                          setTimeElapsed(0);
                        }}
                        className="py-4 px-8 bg-white/10 border border-white/20 rounded-xl font-semibold text-gray-300 hover:bg-white/20 transition-all"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {!isPracticing && currentQuestion && (
                <motion.div
                  key="question-detail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-8 border-cyan-500/30"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="px-3 py-1 rounded text-sm font-medium border border-cyan-500/30 text-cyan-400">
                        {currentQuestion.category}
                      </span>
                      <h2 className="text-2xl font-bold mt-4 text-white">
                        {currentQuestion.question}
                      </h2>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium border ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {currentQuestion.difficulty}
                    </span>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-r from-pink-900/30 to-orange-900/30 border border-pink-500/20 mb-8">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-400" />
                      How to approach this question
                    </h3>
                    <ol className="space-y-3">
                      {currentQuestion.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-200">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {i + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <button
                    onClick={() => startPractice(currentQuestion)}
                    className="w-full py-5 bg-gradient-to-r from-pink-500 to-orange-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3"
                  >
                    <Play className="w-6 h-6" />
                    Start Practice Timer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
