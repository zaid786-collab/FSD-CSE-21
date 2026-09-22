import React from 'react';
import { ArrowDownRight, Download, Terminal } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

export function Hero() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};

  const name = profile.name || 'Mohammad Zaid Khan';
  const location = profile.location || 'Noida, India';
  const availabilityStatus = profile.availabilityStatus || 'Available for Opportunities';
  const headline = profile.headline || 'Building scalable software, solving problems through DSA/CP, and exploring AI/GenAI.';
  const resumeUrl = profile.resumeUrl || '/Mohammad_Zaid_Khan_Resume.pdf';

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[88vh] flex items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#232320]"
    >
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Strong Editorial Presentation */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Subtle Status Marker */}
          <div className="flex items-center gap-2 mb-6 font-mono text-xs text-[#9E9E96]">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span>{location}</span>
            <span className="text-[#3A3A34]">—</span>
            <span className="text-[#EDEDEB]">{availabilityStatus}</span>
          </div>

          {/* Developer Name */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#EDEDEB] tracking-tight mb-4 leading-[1.1]">
            Mohammad <span className="italic font-normal text-[#E6C65C]">Zaid</span> Khan
          </h1>

          {/* Primary Titles Stack */}
          <div className="font-mono text-sm sm:text-base text-[#D4AF37] font-medium tracking-wide mb-6 flex flex-wrap items-center gap-2">
            <span>Software Engineer</span>
            <span className="text-[#3A3A34]">/</span>
            <span>Full-Stack Developer</span>
            <span className="text-[#3A3A34]">/</span>
            <span>Competitive Programmer</span>
          </div>

          {/* Supporting Copy */}
          <p className="text-sm sm:text-base text-[#9E9E96] max-w-xl leading-relaxed mb-8">
            {headline}
          </p>

          {/* Restrained CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
            <a
              href="#projects"
              onClick={(e) => handleScrollTo(e, '#projects')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] font-mono text-xs font-semibold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            >
              <span>View Selected Work</span>
              <ArrowDownRight size={14} />
            </a>

            <a
              href={resumeUrl}
              download="Mohammad_Zaid_Khan_Resume.pdf"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-[#171713] hover:bg-[#1D1D18] text-[#EDEDEB] border border-[#2A2A24] hover:border-[#D4AF37]/50 font-mono text-xs font-medium tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            >
              <Download size={13} className="text-[#D4AF37]" />
              <span>Download Resume</span>
            </a>

            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, '#contact')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-[#9E9E96] hover:text-[#EDEDEB] font-mono text-xs transition-colors"
            >
              <span>Contact</span>
            </a>
          </div>
        </div>

        {/* Right Column: Understated Developer Workspace Vignette */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded bg-[#11110F] border border-[#232320] p-5 font-mono text-xs shadow-lg">
            {/* Minimalist Terminal Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1D1D1A] text-[11px] text-[#9E9E96]">
              <span className="flex items-center gap-1.5 text-[#D4AF37]">
                <Terminal size={12} />
                <span>zaid@engineer:~</span>
              </span>
              <span className="text-[#5A5A52]">bash</span>
            </div>

            {/* Verified Profile Matrix */}
            <div className="space-y-2.5 text-[11px] text-[#9E9E96] leading-relaxed">
              <div>
                <span className="text-[#5A5A52]">$ </span>
                <span className="text-[#EDEDEB]">profile.identity</span>
              </div>
              <div className="pl-3 border-l border-[#232320] space-y-1 text-[#9E9E96]">
                <p>name: <span className="text-[#EDEDEB]">"{name}"</span></p>
                <p>institution: <span className="text-[#EDEDEB]">"ABES Engineering College"</span></p>
                <p>degree: <span className="text-[#EDEDEB]">"B.Tech CSE (2025–2029)"</span></p>
                <p>academics: <span className="text-[#D4AF37]">"CGPA: 9.1"</span></p>
              </div>

              <div className="pt-2">
                <span className="text-[#5A5A52]">$ </span>
                <span className="text-[#EDEDEB]">cp.metrics</span>
              </div>
              <div className="pl-3 border-l border-[#232320] space-y-1 text-[#9E9E96]">
                <p>leetcode_solved: <span className="text-[#EDEDEB]">334</span> <span className="text-[#5A5A52]">(Rating: 1637)</span></p>
                <p>codechef_solved: <span className="text-[#EDEDEB]">619</span> <span className="text-[#5A5A52]">(Rating: 1420)</span></p>
                <p>streak_badges: <span className="text-[#D4AF37]">["50d", "100d", "200d"]</span></p>
              </div>

              <div className="pt-2">
                <span className="text-[#5A5A52]">$ </span>
                <span className="text-[#EDEDEB]">focus.current</span>
              </div>
              <div className="pl-3 border-l border-[#232320] text-[#9E9E96]">
                <p className="text-[#EDEDEB]">["Backend Systems", "DSA / CP", "AI / GenAI"]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
