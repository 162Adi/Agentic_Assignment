import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  Wrench,
  BookOpen,
  Database,
  Layers,
  Cpu,
  GitBranch,
  Users,
  CloudLightning,
  Code2,
  ShieldCheck,
  Activity,
  Award,
} from 'lucide-react';
import { fetchLabs } from '../services/api';
import { LabSummary } from '../types';
import { useAppStore } from '../stores/useAppStore';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  Wrench,
  FileText: BookOpen,
  Database,
  Layers,
  Cpu,
  GitBranch,
  Users,
  Search,
  CloudLightning,
  Code: Code2,
  ShieldCheck,
  Activity,
  Award,
};

export const LabExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const globalSearch = useAppStore((s) => s.globalSearch);
  const [labs, setLabs] = useState<LabSummary[]>([]);
  const [search, setSearch] = useState(globalSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabs()
      .then(setLabs)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (globalSearch) setSearch(globalSearch);
  }, [globalSearch]);

  const categories = ['All', ...new Set(labs.map((l) => l.category))];

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.title.toLowerCase().includes(search.toLowerCase()) ||
      lab.description.toLowerCase().includes(search.toLowerCase()) ||
      lab.category.toLowerCase().includes(search.toLowerCase()) ||
      `lab ${lab.id}`.includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || lab.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-xs font-mono font-medium mb-1 border border-violet-500/20">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>LAB DIRECTORY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Lab Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse all 14 intelligent agent implementations and 42 executable programs.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter labs by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 w-64 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-violet-600 border-violet-500 text-white font-semibold shadow-sm'
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLabs.map((lab, index) => {
          const Icon = ICON_MAP[lab.icon] || FlaskConical;
          return (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              onClick={() => navigate(`/labs/${lab.id}`)}
              className="group rounded-xl border border-white/5 bg-[#0e1322]/90 hover:bg-[#12192d] p-5 cursor-pointer transition-all duration-300 hover:border-violet-500/30 hover:shadow-glow-violet hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    LAB {String(lab.id).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {lab.category}
                  </span>
                </div>

                <div className="flex items-start gap-3 mt-1">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-violet-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-white transition-colors">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                      {lab.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                  <span>3 Programs</span>
                  <span>•</span>
                  <span>{lab.tools_count} Tools</span>
                  <span>•</span>
                  <span>{lab.skills_count} Skills</span>
                </div>

                <span className="text-violet-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold text-[11px]">
                  <span>Launch</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredLabs.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-xs font-mono">
          No labs found matching &quot;{search}&quot;. Try clearing filters.
        </div>
      )}
    </div>
  );
};
