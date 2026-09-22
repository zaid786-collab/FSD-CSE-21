import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { usePortfolio } from '../../context/PortfolioContext';

export function Projects() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || [];

  const featuredProject = projects.length > 0 ? projects[0] : null;
  const remainingProjects = projects.length > 1 ? projects.slice(1) : [];

  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>03</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Selected Works</span>
          </div>
          <span className="text-xs font-mono text-[#5A5A52]">
            {projects.length > 0 ? `${projects.length} Core Software Engineering Projects` : 'Core Software Engineering Projects'} • Project Leader
          </span>
        </div>

        <div className="space-y-10">
          {/* FEATURED HERO PROJECT */}
          {featuredProject && (
            <article className="p-8 sm:p-10 rounded bg-[#11110F] border border-[#232320] hover:border-[#D4AF37]/40 transition-all duration-200 group relative">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#1D1D1A]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#D4AF37] font-semibold">
                    01 // FEATURED PLATFORM
                  </span>
                  <span className="text-[#3A3A34]">·</span>
                  <span className="text-xs font-mono text-[#9E9E96]">Role: {featuredProject.role || 'Project Leader'}</span>
                </div>
                <div className="flex items-center gap-4">
                  {featuredProject.githubUrl && (
                    <a
                      href={featuredProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-[#9E9E96] hover:text-[#EDEDEB] transition-colors"
                    >
                      <GithubIcon size={14} />
                      <span>GitHub</span>
                      <ExternalLink size={10} className="text-[#5A5A52]" />
                    </a>
                  )}
                  {featuredProject.liveDemoUrl && (
                    <a
                      href={featuredProject.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-mono text-[#D4AF37] hover:text-[#E6C65C] transition-colors"
                    >
                      <ExternalLink size={12} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#EDEDEB] mb-2 group-hover:text-[#E6C65C] transition-colors">
                    {featuredProject.name}
                  </h3>
                  <p className="font-mono text-xs text-[#D4AF37] mb-4">
                    {featuredProject.tagline}
                  </p>
                  <p className="text-sm text-[#9E9E96] leading-relaxed mb-6">
                    {featuredProject.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(featuredProject.techStack || []).map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded text-xs font-mono text-[#9E9E96] bg-[#171713] border border-[#232320]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-between h-full pt-2">
                  <div className="p-4 rounded bg-[#171713] border border-[#232320] text-xs font-mono text-[#9E9E96] space-y-2 mb-6">
                    <span className="text-[#EDEDEB] font-semibold block text-[11px] uppercase tracking-wider">Key Architecture</span>
                    {featuredProject.problemStatement && (
                      <p className="text-[11px] text-[#5A5A52] line-clamp-3">• {featuredProject.problemStatement}</p>
                    )}
                    {featuredProject.features && featuredProject.features.slice(0, 2).map((f, idx) => (
                      <p key={idx}>• {f}</p>
                    ))}
                  </div>

                  <Link
                    to={`/projects/${featuredProject.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#D4AF37] hover:text-[#E6C65C] transition-colors group/link self-start"
                  >
                    <span>Read In-Depth Case Study</span>
                    <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          )}

          {/* GRID OF REMAINING PROJECTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {remainingProjects.map((p, idx) => (
              <article
                key={p.slug}
                className="p-7 rounded bg-[#11110F] border border-[#232320] hover:border-[#D4AF37]/40 transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4 text-xs font-mono text-[#9E9E96]">
                    <span className="text-[#D4AF37]">0{idx + 2} // {p.role || 'ENGINEERING PROJECT'}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#EDEDEB] mb-2 group-hover:text-[#E6C65C] transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-mono text-xs text-[#9E9E96] mb-3">
                    {p.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-[#9E9E96] leading-relaxed mb-6">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(p.techStack || []).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono text-[#9E9E96] bg-[#171713] border border-[#232320]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1D1D1A] flex items-center justify-between text-xs font-mono">
                  {p.githubUrl ? (
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#9E9E96] hover:text-[#EDEDEB] transition-colors"
                    >
                      <GithubIcon size={14} />
                      <span>Repository</span>
                    </a>
                  ) : <span />}

                  <Link
                    to={`/projects/${p.slug}`}
                    className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#E6C65C] transition-colors"
                  >
                    <span>Case Study</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
