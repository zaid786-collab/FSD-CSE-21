import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const defaultSkillLedger = [
  {
    category: 'Languages',
    items: ['C', 'C++', 'Java', 'JavaScript', 'Python']
  },
  {
    category: 'Frontend',
    items: ['HTML', 'CSS', 'React']
  },
  {
    category: 'Backend',
    items: ['Node.js', 'Express.js', 'Flask']
  },
  {
    category: 'Database',
    items: ['MongoDB', 'SQL']
  },
  {
    category: 'Developer Tools',
    items: ['Git', 'GitHub', 'Docker']
  },
  {
    category: 'Emerging Technologies',
    items: ['AI / GenAI Fundamentals']
  }
];

export function Skills() {
  const { portfolioData } = usePortfolio();

  const activeLedger = React.useMemo(() => {
    if (!portfolioData?.skills || portfolioData.skills.length === 0) {
      return defaultSkillLedger;
    }

    const categories = ['Languages', 'Frontend', 'Backend', 'Database', 'Tools', 'Other'];
    const map = {};
    categories.forEach(c => { map[c] = []; });

    portfolioData.skills.forEach(s => {
      const cat = map[s.category] ? s.category : 'Other';
      map[cat].push(s.name);
    });

    const result = [];
    categories.forEach(cat => {
      if (map[cat] && map[cat].length > 0) {
        result.push({
          category: cat === 'Tools' ? 'Developer Tools' : (cat === 'Other' ? 'Emerging Technologies' : cat),
          items: map[cat]
        });
      }
    });

    return result.length > 0 ? result : defaultSkillLedger;
  }, [portfolioData?.skills]);

  return (
    <section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>02</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Technical Capabilities</span>
          </div>
          <span className="text-xs font-mono text-[#5A5A52]">
            Languages, Frameworks, and Infrastructure
          </span>
        </div>

        {/* Clean Technical Ledger */}
        <div className="divide-y divide-[#1D1D1A] border-y border-[#1D1D1A]">
          {activeLedger.map((row) => (
            <div
              key={row.category}
              className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:bg-[#11110F]/50 px-2 transition-colors duration-150"
            >
              <div className="md:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#9E9E96] group-hover:text-[#D4AF37] transition-colors">
                  {row.category}
                </span>
              </div>
              <div className="md:col-span-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                {row.items.map((skill, i) => (
                  <React.Fragment key={skill}>
                    <span className="text-sm font-mono text-[#EDEDEB] font-medium">
                      {skill}
                    </span>
                    {i < row.items.length - 1 && (
                      <span className="text-[#3A3A34] text-xs font-mono">·</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
