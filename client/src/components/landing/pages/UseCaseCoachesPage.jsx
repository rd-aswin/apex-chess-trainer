import React from 'react';
import { 
  Users, Award, Check, ArrowRight, BookOpen, Layers, Sparkles 
} from 'lucide-react';

export function UseCaseCoachesPage({ onNavigate, onLaunchApp }) {
  return (
    <div className="min-h-screen text-slate-100 pt-28 pb-20 selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 mb-4">
          <Users className="w-3.5 h-3.5" />
          <span>Coaching Leverage Engine</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4">
          Give Every Student a 24/7 Grandmaster Assistant
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Automate student game homework reviews, aggregate class blunder patterns, and multiply your coaching impact 10x without spending hours writing manual PGN annotations.
        </p>
      </div>

      {/* 3 CORE PILLARS */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Batch Student PGN Audits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import 30 student games at once. Apex generates articulate pedagogical summaries for each game in minutes.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Classroom Blunder Fingerprinting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover which tactical motifs your entire class is struggling with (e.g. 73% of students missing back-rank pins).
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Printable Anki & PGN Exports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export custom drill sets directly into student Anki decks or print formatted tactical puzzle worksheets for physical classes.
            </p>
          </div>

        </div>

        {/* BOTTOM CTA */}
        <div className="bg-gradient-to-r from-indigo-500/10 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Equip Your Academy with Apex</h3>
            <p className="text-xs text-slate-400 mt-1">Free open-source tools with zero per-student cloud seat licensing fees.</p>
          </div>
          <button
            onClick={onLaunchApp}
            className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 bg-indigo-400 hover:bg-indigo-300 transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
          >
            Launch Coach Workspace
          </button>
        </div>

      </div>

    </div>
  );
}
