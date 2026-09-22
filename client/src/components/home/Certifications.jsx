import React from 'react';
import { ExternalLink } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const defaultCredentials = [
  {
    title: 'NIELIT O Level',
    issuer: 'National Institute of Electronics & Information Technology',
    status: 'In Progress (3 modules completed, 1 remaining)',
    category: 'Foundations'
  },
  {
    title: 'Microsoft Certified Data Analyst',
    issuer: 'Microsoft',
    status: 'Completed',
    category: 'Data Analytics'
  },
  {
    title: 'Generative AI: Introduction to AI',
    issuer: 'IBM / Leading Providers',
    status: 'Completed',
    category: 'AI / GenAI'
  },
  {
    title: 'Generative AI: Introduction & Applications',
    issuer: 'IBM / Leading Providers',
    status: 'Completed',
    category: 'AI / GenAI'
  },
  {
    title: 'Prompt Engineering Basics',
    issuer: 'IBM / Leading Providers',
    status: 'Completed',
    category: 'AI / GenAI'
  },
  {
    title: 'Python for Data Science, AI & Development',
    issuer: 'IBM / Leading Providers',
    status: 'Completed',
    category: 'Data Science'
  },
  {
    title: 'Claude AI',
    issuer: 'PW Skills',
    status: 'Completed',
    category: 'AI / GenAI'
  }
];

export function Certifications() {
  const { portfolioData } = usePortfolio();

  const activeCredentials = React.useMemo(() => {
    if (portfolioData?.certifications && portfolioData.certifications.length > 0) {
      return portfolioData.certifications.map(c => ({
        title: c.title,
        issuer: c.issuer,
        status: c.status || 'Completed',
        category: c.category || 'Technical',
        credentialUrl: c.credentialUrl || ''
      }));
    }
    return defaultCredentials;
  }, [portfolioData?.certifications]);

  return (
    <section id="certifications" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-4xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>06</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Certifications & Accreditations</span>
          </div>
          <span className="text-xs font-mono text-[#5A5A52]">
            Verified Learning Credentials
          </span>
        </div>

        {/* Clean Ledger Grid */}
        <div className="space-y-3">
          {activeCredentials.map((cert) => (
            <div
              key={cert.title}
              className="p-5 rounded bg-[#11110F] border border-[#232320] hover:border-[#D4AF37]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[#EDEDEB] font-serif group-hover:text-[#E6C65C] transition-colors">
                    {cert.title}
                  </h3>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9E9E96] hover:text-[#D4AF37] transition-colors"
                      title="View Credential"
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                <div className="text-xs font-mono text-[#5A5A52]">
                  {cert.issuer}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-[#9E9E96] hidden md:inline">
                  {cert.category}
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-medium text-[#D4AF37] bg-[#D4AF37]/5 border border-[#D4AF37]/20">
                  {cert.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
