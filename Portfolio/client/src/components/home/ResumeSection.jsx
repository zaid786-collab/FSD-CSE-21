import React from 'react';
import { Download } from 'lucide-react';

export function ResumeSection() {
  return (
    <section id="resume" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-12">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>08</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Curriculum Vitae</span>
          </div>
          <span className="text-xs font-mono text-[#5A5A52]">
            ATS-Friendly One-Page Document
          </span>
        </div>

        <div className="p-8 rounded bg-[#11110F] border border-[#232320] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-serif font-bold text-[#EDEDEB]">
              Mohammad Zaid Khan — Engineering Resume
            </h3>
            <p className="text-xs sm:text-sm text-[#9E9E96] max-w-lg leading-relaxed">
              Concise single-page document summarizing technical stack, competitive programming milestones, project ownership, and academic credentials.
            </p>
          </div>

          <a
            href="/Mohammad_Zaid_Khan_Resume.pdf"
            download="Mohammad_Zaid_Khan_Resume.pdf"
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] font-mono text-xs font-semibold tracking-wide transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
          >
            <Download size={14} />
            <span>Download Resume (PDF)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
