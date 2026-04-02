import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { templateService, ResumeTemplate } from '../services/templateService';
import {
  FileText,
  Download,
  Loader2,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';
import NeonButton from '../components/UI/NeonButton';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  // Extract unique industries from templates
  const industries = ['all', ...new Set(templates.flatMap(t => t.industry))];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const result = await templateService.list();
      setTemplates(result.templates);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || t.industry.includes(selectedIndustry);
    return matchesSearch && matchesIndustry;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading templates...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Resume Templates</h1>
          <p className="text-gray-400">
            Choose a professional template to create your perfect resume
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none"
              />
            </div>

            {/* Industry Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all outline-none text-white"
              >
                {industries.map(ind => (
                  <option key={ind} value={ind} className="bg-dark-800">
                    {ind === 'all' ? 'All Industries' : ind}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No templates found matching your criteria</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => {/* Could open preview */}}
              >
                {/* Preview Image / Placeholder */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                  {template.preview_url ? (
                    <img
                      src={template.preview_url}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <FileText className="w-16 h-16 text-gray-600" />
                  )}
                  <div className="absolute top-2 right-2">
                    {template.ats_score && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (template.ats_score || 0) >= 80
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        ATS: {template.ats_score}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                    {template.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.industry.map(ind => (
                      <span
                        key={ind}
                        className="px-2 py-1 rounded-full text-xs bg-white/10 text-gray-300"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {template.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <NeonButton
                      variant="primary"
                      size="sm"
                      icon={<Download className="w-4 h-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (template.file_url) {
                          window.open(template.file_url, '_blank');
                        }
                      }}
                    >
                      Download
                    </NeonButton>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
