import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const focusAreas = [
  {
    title: 'Full-Stack Engineering',
    desc: 'Building responsive frontend architectures in React with clean state management, modular components, and accessible interfaces.'
  },
  {
    title: 'Backend & Systems',
    desc: 'Designing structured REST APIs in Node.js, Express, and Flask, with MongoDB/SQL data modeling and rate-limiting security.'
  },
  {
    title: 'DSA & Competitive Programming',
    desc: 'Daily algorithmic problem solving on LeetCode and CodeChef, prioritizing optimal time and space complexity in C++ and Java.'
  },
  {
    title: 'AI / GenAI Exploration',
    desc: 'Integrating context-aware LLM pipelines, multimodal speech/video analysis, and prompt architectures into practical software products.'
  }
];

export function About() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Section Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-baseline">
          <div className="md:col-span-4 font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>01</span>
            <span className="text-[#3A3A34]">—</span>
            <span>About Me</span>
          </div>

          <div className="md:col-span-8 space-y-6 text-[#EDEDEB]">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#EDEDEB] leading-snug">
              Developing disciplined software with strong technical foundations.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#9E9E96] leading-relaxed">
              <p>
                {profile.bio || 'I am a Computer Science & Engineering undergraduate at ABES Engineering College (CGPA: 9.1). My daily routine is split between algorithmic problem solving through Data Structures & Algorithms, building scalable backend services, and shipping responsive web applications.'}
              </p>
              <p>
                I value clear code architecture, explicit data contracts, and restrained engineering. Rather than adopting tools for novelty, I focus on understanding underlying system mechanics—whether that means profiling memory in a coding sandbox or designing secure session auth for an administrative dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Minimalist Focus Ledger */}
        <div className="pt-10 border-t border-[#1D1D1A]">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#5A5A52] block mb-8">
            Core Engineering Competencies
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {focusAreas.map((area, idx) => (
              <div key={area.title} className="flex items-start gap-4">
                <span className="font-mono text-xs text-[#D4AF37] mt-0.5">
                  0{idx + 1}.
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#EDEDEB] font-mono mb-1.5">
                    {area.title}
                  </h3>
                  <p className="text-xs text-[#9E9E96] leading-relaxed">
                    {area.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
