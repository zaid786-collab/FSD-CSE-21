import React from 'react';
import { ExternalLink } from 'lucide-react';

export function CompetitiveProgramming() {
  return (
    <section id="competitive-programming" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-16">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2">
            <span>04</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Competitive Programming</span>
          </div>
          <span className="text-xs font-mono text-[#5A5A52]">
            Algorithmic Problem Solving & Platform Metrics
          </span>
        </div>

        {/* Typographic Numbers Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-12 mb-12 border-b border-[#1D1D1A]">
          <div>
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#D4AF37] block mb-1">
              950+
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9E9E96]">
              Total Problems Solved
            </span>
            <p className="text-[11px] text-[#5A5A52] font-mono mt-1">Across LeetCode & CodeChef</p>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#EDEDEB] block mb-1">
              1637
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9E9E96]">
              LeetCode Rating
            </span>
            <p className="text-[11px] text-[#5A5A52] font-mono mt-1">Peak Contest Performance</p>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#EDEDEB] block mb-1">
              1420
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9E9E96]">
              CodeChef Rating
            </span>
            <p className="text-[11px] text-[#5A5A52] font-mono mt-1">2★ Tier (Division 3)</p>
          </div>

          <div>
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#D4AF37] block mb-1">
              200+
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9E9E96]">
              Day Streak Badge
            </span>
            <p className="text-[11px] text-[#5A5A52] font-mono mt-1">Consistency Achievement</p>
          </div>
        </div>

        {/* Platform Breakdown Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LeetCode */}
          <div className="p-6 rounded bg-[#11110F] border border-[#232320] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1D1D1A]">
                <span className="font-mono text-xs font-bold text-[#EDEDEB] tracking-wide">LEETCODE</span>
                <a
                  href="https://leetcode.com/u/MOHAMMADZAIDKHAN7/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[#9E9E96] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                >
                  <span>@MOHAMMADZAIDKHAN7</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div className="space-y-2.5 text-xs font-mono mb-6">
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Problems Solved:</span>
                  <span className="text-[#EDEDEB] font-semibold">334</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Contest Rating:</span>
                  <span className="text-[#D4AF37] font-semibold">1637</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Badges Earned:</span>
                  <span className="text-[#EDEDEB]">50d, 100d, 200d</span>
                </div>
              </div>
            </div>

            <a
              href="https://leetcode.com/u/MOHAMMADZAIDKHAN7/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2 rounded bg-[#171713] text-[#9E9E96] hover:text-[#EDEDEB] text-[11px] font-mono border border-[#232320] transition-colors"
            >
              Verify Profile &rarr;
            </a>
          </div>

          {/* CodeChef */}
          <div className="p-6 rounded bg-[#11110F] border border-[#232320] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1D1D1A]">
                <span className="font-mono text-xs font-bold text-[#EDEDEB] tracking-wide">CODECHEF</span>
                <a
                  href="https://www.codechef.com/users/zaid_khan07"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[#9E9E96] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                >
                  <span>@zaid_khan07</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div className="space-y-2.5 text-xs font-mono mb-6">
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Problems Solved:</span>
                  <span className="text-[#EDEDEB] font-semibold">619</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Rating Tier:</span>
                  <span className="text-[#D4AF37] font-semibold">1420 (2★)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Division:</span>
                  <span className="text-[#EDEDEB]">Division 3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Badge:</span>
                  <span className="text-[#EDEDEB]">Diamond Badge</span>
                </div>
              </div>
            </div>

            <a
              href="https://www.codechef.com/users/zaid_khan07"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2 rounded bg-[#171713] text-[#9E9E96] hover:text-[#EDEDEB] text-[11px] font-mono border border-[#232320] transition-colors"
            >
              Verify Profile &rarr;
            </a>
          </div>

          {/* Codeforces */}
          <div className="p-6 rounded bg-[#11110F] border border-[#232320] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1D1D1A]">
                <span className="font-mono text-xs font-bold text-[#EDEDEB] tracking-wide">CODEFORCES</span>
                <a
                  href="https://codeforces.com/profile/MohammadZaidKhan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-[#9E9E96] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
                >
                  <span>@MohammadZaidKhan</span>
                  <ExternalLink size={10} />
                </a>
              </div>

              <div className="space-y-2.5 text-xs font-mono mb-6">
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Contests Participated:</span>
                  <span className="text-[#EDEDEB] font-semibold">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Status:</span>
                  <span className="text-[#9E9E96]">Currently Unrated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9E9E96]">Activity:</span>
                  <span className="text-[#EDEDEB]">Active Participant</span>
                </div>
              </div>
            </div>

            <a
              href="https://codeforces.com/profile/MohammadZaidKhan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2 rounded bg-[#171713] text-[#9E9E96] hover:text-[#EDEDEB] text-[11px] font-mono border border-[#232320] transition-colors"
            >
              Verify Profile &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
