import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const defaultTimelineEntries = [
  {
    role: 'Microsoft Dynamics 365 Analyst',
    organization: 'IT Solutions',
    period: 'Ongoing',
    location: 'Remote',
    category: 'Freelance Consulting',
    description: 'Providing technical consulting, workflow automation analysis, and data mapping for Microsoft Dynamics 365 enterprise implementations.'
  },
  {
    role: 'Team Leader',
    organization: 'Smart India Hackathon (SIH)',
    period: 'Hackathon Leadership',
    location: 'India',
    category: 'National Hackathon',
    description: 'Directed engineering team in architecting technical solutions addressing real-world problem statements, coordinating sprint milestones and technical solution defense.'
  },
  {
    role: 'Team Leader',
    organization: 'Build with Bharat',
    period: 'Hackathon Leadership',
    location: 'India',
    category: 'National Hackathon',
    description: 'Led technical team during rapid prototyping and software development sprints to engineer scalable digital systems.'
  },
  {
    role: 'B.Tech — Computer Science & Engineering',
    organization: 'ABES Engineering College',
    period: '2025 – 2029',
    location: 'Ghaziabad, India',
    category: 'Undergraduate Degree',
    description: 'Core focus on Data Structures & Algorithms, Object-Oriented Software Design, Database Systems, and Computer Architecture. Current CGPA: 9.1.'
  }
];

export function Journey() {
  const { portfolioData } = usePortfolio();

  const activeEntries = React.useMemo(() => {
    const list = [];

    if (portfolioData?.experience && portfolioData.experience.length > 0) {
      portfolioData.experience.forEach(e => {
        list.push({
          role: e.role || e.title,
          organization: e.organization || e.company,
          period: e.period || (e.startDate && e.endDate ? `${e.startDate} – ${e.endDate}` : 'Ongoing'),
          location: e.location || 'Remote',
          category: e.employmentType || e.type || 'Experience',
          description: e.description
        });
      });
    }

    if (portfolioData?.hackathons && portfolioData.hackathons.length > 0) {
      portfolioData.hackathons.forEach(h => {
        list.push({
          role: h.role || 'Team Leader',
          organization: h.name,
          period: h.date || 'Hackathon Leadership',
          location: h.location || 'India',
          category: 'National Hackathon',
          description: h.description
        });
      });
    }

    if (portfolioData?.education && portfolioData.education.length > 0) {
      portfolioData.education.forEach(edu => {
        list.push({
          role: edu.degree + (edu.fieldOfStudy ? ` — ${edu.fieldOfStudy}` : ''),
          organization: edu.institution,
          period: edu.period || `${edu.startYear} – ${edu.endYear}`,
          location: 'Ghaziabad, India',
          category: 'Undergraduate Degree',
          description: edu.description ? `${edu.description} Current CGPA: ${edu.cgpa}.` : `Core focus on Computer Science and Engineering. Current CGPA: ${edu.cgpa}.`
        });
      });
    }

    return list.length > 0 ? list : defaultTimelineEntries;
  }, [portfolioData?.experience, portfolioData?.hackathons, portfolioData?.education]);

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-4xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>05</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Career Journal</span>
          </div>
          <span className="text-xs font-mono text-[#5A5A52]">
            Experience, Leadership & Academic Timeline
          </span>
        </div>

        {/* Career Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l border-[#232320] space-y-12">
          {activeEntries.map((entry, idx) => (
            <div key={idx} className="relative group">
              {/* Subtle Gold Timeline Marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#0B0B0A] border border-[#D4AF37] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>

              {/* Time & Meta Tagline */}
              <div className="flex flex-wrap items-center gap-2.5 mb-2 font-mono text-xs">
                <span className="text-[#D4AF37] font-semibold">{entry.period}</span>
                <span className="text-[#3A3A34]">·</span>
                <span className="text-[#9E9E96]">{entry.location}</span>
                <span className="text-[#3A3A34]">·</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono text-[#9E9E96] bg-[#171713] border border-[#232320]">
                  {entry.category}
                </span>
              </div>

              {/* Role & Org */}
              <h3 className="text-lg font-serif font-bold text-[#EDEDEB] mb-1 group-hover:text-[#E6C65C] transition-colors">
                {entry.role}
              </h3>
              <div className="text-xs font-mono text-[#9E9E96] mb-3">
                {entry.organization}
              </div>

              {/* Description */}
              <p className="text-sm text-[#9E9E96] leading-relaxed max-w-2xl">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
