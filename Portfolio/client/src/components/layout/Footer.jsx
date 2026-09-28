import React from 'react';
import { BrandMark } from '../common/BrandMark';
import { ExternalLink } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { usePortfolio } from '../../context/PortfolioContext';

export function Footer() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};
  const footerCopyright = profile.footerCopyright || '© 2026 Mohammad Zaid Khan';

  const verifiedProfiles = [
    { name: 'LinkedIn', url: profile.linkedinUrl || 'https://www.linkedin.com/in/mohammad-zaid-khan-a2927a370/', icon: LinkedinIcon },
    { name: 'GitHub', url: profile.githubUrl || 'https://github.com/zaid786-collab', icon: GithubIcon },
    { name: 'LeetCode', url: profile.leetcodeUrl || 'https://leetcode.com/u/MOHAMMADZAIDKHAN7/', isText: true, label: 'LC' },
    { name: 'CodeChef', url: profile.codechefUrl || 'https://www.codechef.com/users/zaid_khan07', isText: true, label: 'CC' },
    { name: 'Codeforces', url: profile.codeforcesUrl || 'https://codeforces.com/profile/MohammadZaidKhan', isText: true, label: 'CF' }
  ];

  return (
    <footer className="bg-[#0B0B0A] py-12 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <BrandMark size={24} showText={false} />
          <div>
            <span className="font-mono text-xs font-semibold tracking-wider text-[#EDEDEB] block">
              {profile.name || 'Mohammad Zaid Khan'}
            </span>
            <span className="text-[11px] font-mono text-[#5A5A52]">
              {profile.title || 'Software Engineer | Full-Stack Developer | Competitive Programmer'}
            </span>
          </div>
        </div>

        {/* Verified Links */}
        <div className="flex items-center gap-4 flex-wrap justify-center text-xs font-mono">
          {verifiedProfiles.map((p) => {
            const Icon = p.icon;
            return (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#9E9E96] hover:text-[#EDEDEB] transition-colors py-1"
              >
                {Icon ? <Icon size={13} /> : <span className="font-bold text-[#D4AF37]">{p.label}</span>}
                <span>{p.name}</span>
                <ExternalLink size={10} className="text-[#5A5A52]" />
              </a>
            );
          })}
        </div>

        {/* Exact Copyright */}
        <div className="text-xs font-mono text-[#5A5A52]">
          {footerCopyright}
        </div>
      </div>
    </footer>
  );
}
