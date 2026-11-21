import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Search,
  FileCode,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { fetchSkills } from '../services/api';
import { SkillMetadata } from '../types';

export const SkillsRegistryPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillMetadata[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills()
      .then((data) => {
        setSkills(data);
        if (data.length > 0) setSelectedSkill(data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.lab_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-medium mb-1 border border-blue-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>REUSABLE CAPABILITIES</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            Skills Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Modular prompt and programmatic skill capsules extracted from the original 14 labs.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-violet-500/50 w-60 font-mono"
          />
        </div>
      </div>

      {/* Split View: Left List, Right Documentation Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skills List Column */}
        <div className="lg:col-span-5 space-y-3">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkill?.id === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/15 border-violet-500/40 shadow-glow-violet'
                    : 'bg-[#0e1322]/90 border-white/5 hover:border-white/15 hover:bg-[#12192d]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                    {skill.lab_title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {skill.examples.length} Example{skill.examples.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-100 font-mono">
                  {skill.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs font-mono text-slate-500 pt-2 border-t border-white/5">
                  <span>ƒ {skill.function_or_class}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Documentation & Inspection Column */}
        <div className="lg:col-span-7">
          {selectedSkill ? (
            <div className="rounded-2xl border border-white/10 bg-[#0e1322] p-6 space-y-5 shadow-xl sticky top-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded border border-violet-500/20">
                    {selectedSkill.lab_title}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Reusable Skill
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-white font-mono">
                  {selectedSkill.name}
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Step-by-Step Instructions
                </h4>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1.5 text-xs text-slate-300 font-mono">
                  {selectedSkill.instructions.map((inst, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-violet-400">•</span>
                      <span>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Operating Constraints
                </h4>
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 space-y-1.5 text-xs text-rose-300 font-mono">
                  {selectedSkill.constraints.map((c, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* I/O Example */}
              {selectedSkill.examples.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Input / Output Contract
                  </h4>
                  <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block">Sample Input:</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{selectedSkill.examples[0].input}</p>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] text-slate-500 uppercase block">Expected Output:</span>
                      <p className="text-emerald-400 text-[11px] mt-0.5">{selectedSkill.examples[0].expected_output}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reusability Information */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                <span>Scope: <strong className="text-slate-200">{selectedSkill.reusability}</strong></span>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500 font-mono text-xs">
              Select a skill to inspect its documentation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
