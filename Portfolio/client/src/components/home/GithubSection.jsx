import React, { useState, useEffect } from 'react';
import { Star, GitFork, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../common/Icons';

const fallbackGithub = {
  user: {
    login: 'zaid786-collab',
    name: 'Mohammad Zaid Khan',
    public_repos: 14,
    followers: 2,
    following: 3,
    avatar_url: 'https://avatars.githubusercontent.com/u/213315430?v=4',
    html_url: 'https://github.com/zaid786-collab'
  },
  repos: [
    {
      name: 'Intervista-AI',
      description: 'Next-Generation AI-Powered Technical Interview & Career Assessment Platform',
      html_url: 'https://github.com/zaid786-collab/Intervista-AI',
      language: 'Python',
      stargazers_count: 5,
      forks_count: 1
    },
    {
      name: 'Crime-Lens',
      description: 'Cybernetic crime investigation and threat telemetry analytics platform',
      html_url: 'https://github.com/mayankkotuli099/Crime-Lens',
      language: 'JavaScript',
      stargazers_count: 4,
      forks_count: 1
    },
    {
      name: 'Smart-Stocks',
      description: 'AI-Powered Investment Intelligence Platform with stock predictions & risk analysis',
      html_url: 'https://github.com/zaid786-collab/Smart-Stocks',
      language: 'JavaScript',
      stargazers_count: 2,
      forks_count: 0
    },
    {
      name: 'Salesforce-Clone',
      description: 'High-fidelity enterprise CRM web portal and lead intake system clone',
      html_url: 'https://github.com/zaid786-collab/Salesforce-Clone',
      language: 'JavaScript',
      stargazers_count: 1,
      forks_count: 0
    }
  ]
};

export function GithubSection() {
  const [data, setData] = useState(fallbackGithub);

  useEffect(() => {
    const fetchGithub = async () => {
      try {
        const res = await fetch('/api/github');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setData(json.data);
          }
        }
      } catch (e) {
        // Fallback already in place
      }
    };
    fetchGithub();
  }, []);

  return (
    <section id="github" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>07</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Open Source & Repositories</span>
          </div>
          <a
            href={data.user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[#9E9E96] hover:text-[#EDEDEB] flex items-center gap-1.5 transition-colors"
          >
            <GithubIcon size={14} />
            <span>github.com/{data.user.login}</span>
            <ExternalLink size={10} className="text-[#5A5A52]" />
          </a>
        </div>

        {/* Minimalist Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 rounded bg-[#11110F] border border-[#232320] hover:border-[#D4AF37]/40 transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-sm font-semibold text-[#EDEDEB] group-hover:text-[#E6C65C] transition-colors truncate">
                    {repo.name}
                  </span>
                  <ExternalLink size={12} className="text-[#5A5A52] group-hover:text-[#D4AF37] transition-colors shrink-0" />
                </div>
                <p className="text-xs text-[#9E9E96] leading-relaxed mb-6 line-clamp-2">
                  {repo.description || 'Public software engineering repository.'}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#5A5A52] pt-4 border-t border-[#1D1D1A]">
                <span className="text-[#9E9E96]">{repo.language || 'Code'}</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Star size={11} className="text-[#D4AF37]" /> {repo.stargazers_count || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={11} /> {repo.forks_count || 0}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
