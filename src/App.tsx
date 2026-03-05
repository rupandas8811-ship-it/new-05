/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  Layout, 
  Plus, 
  Loader2, 
  ChevronRight,
  Trophy,
  Lightbulb,
  Rocket
} from 'lucide-react';

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'immediate' | 'short-term' | 'long-term';
}

interface GoalBlueprint {
  goal: string;
  summary: string;
  tasks: Task[];
  motivation: string;
}

export default function App() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<GoalBlueprint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateBlueprint = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Break down this goal into a structured blueprint: "${input}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING },
              summary: { type: Type.STRING },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['immediate', 'short-term', 'long-term'] }
                  },
                  required: ['id', 'title', 'description', 'category']
                }
              },
              motivation: { type: Type.STRING }
            },
            required: ['goal', 'summary', 'tasks', 'motivation']
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      setBlueprint(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate blueprint. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold tracking-tight text-lg">Vision Architect</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Guide</span>
            <span className="hover:text-zinc-900 cursor-pointer transition-colors">Templates</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-zinc-900 to-zinc-600 bg-clip-text text-transparent"
          >
            What's your next big move?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 text-lg max-w-2xl mx-auto mb-10"
          >
            Enter a goal, dream, or project. Our AI architect will craft a detailed roadmap to help you get there.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateBlueprint()}
              placeholder="e.g., Launch a sustainable coffee brand"
              className="w-full h-16 pl-6 pr-32 bg-white border border-zinc-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
            />
            <button 
              onClick={generateBlueprint}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Architect
            </button>
          </motion.div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          {blueprint && (
            <motion.div 
              key={blueprint.goal}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Summary Card */}
              <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">
                      <Target className="w-4 h-4" />
                      Active Blueprint
                    </div>
                    <h2 className="text-3xl font-bold">{blueprint.goal}</h2>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-2xl">
                    <Trophy className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-zinc-600 leading-relaxed text-lg italic">
                  "{blueprint.summary}"
                </p>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(['immediate', 'short-term', 'long-term'] as const).map((cat) => (
                  <div key={cat} className="space-y-4">
                    <h3 className="font-semibold text-zinc-400 uppercase text-xs tracking-widest pl-2">
                      {cat.replace('-', ' ')}
                    </h3>
                    <div className="space-y-4">
                      {blueprint.tasks.filter(t => t.category === cat).map((task, idx) => (
                        <motion.div 
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group bg-white p-5 rounded-2xl border border-zinc-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-default"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <CheckCircle2 className="w-5 h-5 text-zinc-200 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-zinc-900 mb-1">{task.title}</h4>
                              <p className="text-sm text-zinc-500 leading-snug">{task.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Motivation Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-zinc-900 text-white p-8 rounded-3xl flex items-center gap-6"
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-zinc-400 text-sm uppercase tracking-widest mb-1 font-medium">Architect's Note</p>
                  <p className="text-lg font-medium leading-relaxed">{blueprint.motivation}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Onboarding */}
        {!blueprint && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Rocket, title: "Break Boundaries", desc: "Turn vague ideas into concrete steps." },
              { icon: Layout, title: "Visual Roadmap", desc: "See your journey from now to the finish line." },
              { icon: Sparkles, title: "AI Powered", desc: "Leverage Gemini to find the most efficient path." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50/50">
                <item.icon className="w-6 h-6 text-zinc-400 mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-12 border-t border-zinc-200 mt-12 text-center text-zinc-400 text-sm">
        <p>© 2026 Vision Architect. Built with Gemini AI.</p>
      </footer>
    </div>
  );
}
