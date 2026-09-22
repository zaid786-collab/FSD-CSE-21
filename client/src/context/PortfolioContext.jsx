import React, { createContext, useContext, useState, useEffect } from 'react';

const fallbackPortfolio = {
  profile: {
    name: 'Mohammad Zaid Khan',
    title: 'Software Engineer | Full-Stack Developer | Competitive Programmer',
    headline: 'Building scalable software, solving problems through DSA/CP, and exploring AI/GenAI.',
    location: 'Noida, India',
    email: 'zaidkhan24082006@gmail.com',
    publicEmail: 'zaidkhan24082006@gmail.com',
    bio: 'Computer Science & Engineering student at ABES Engineering College with strong fundamentals in full-stack architecture, backend systems, and competitive programming. Committed to building clean, scalable software, mastering algorithmic problem solving, and exploring modern AI/GenAI technologies.',
    availabilityStatus: 'Available for Opportunities',
    availabilityStatement: 'Open to software engineering opportunities, internships & freelance projects',
    contactFormEnabled: true,
    siteTitle: 'Mohammad Zaid Khan — Software Engineer Portfolio',
    metaDescription: 'Portfolio of Mohammad Zaid Khan - Software Engineer, Full-Stack Developer, and Competitive Programmer.',
    footerCopyright: '© 2026 Mohammad Zaid Khan',
    developerTagline: 'Building scalable software, solving problems through DSA/CP, and exploring AI/GenAI.',
    githubUrl: 'https://github.com/zaid786-collab',
    linkedinUrl: 'https://www.linkedin.com/in/mohammad-zaid-khan-a2927a370/',
    leetcodeUrl: 'https://leetcode.com/u/MOHAMMADZAIDKHAN7/',
    codechefUrl: 'https://www.codechef.com/users/zaid_khan07',
    codeforcesUrl: 'https://codeforces.com/profile/MohammadZaidKhan',
    resumeUrl: '/Mohammad_Zaid_Khan_Resume.pdf'
  },
  skills: [],
  projects: [],
  experience: [],
  education: [],
  certifications: [],
  hackathons: [],
  achievements: []
};

const PortfolioContext = createContext({
  portfolioData: fallbackPortfolio,
  loading: true,
  refreshPortfolio: () => {}
});

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState(fallbackPortfolio);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setPortfolioData(json.data);
          if (json.data.profile?.siteTitle) {
            document.title = json.data.profile.siteTitle;
          }
        }
      }
    } catch (e) {
      console.warn('Portfolio API fetch failed, utilizing verified fallbacks:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider value={{ portfolioData, loading, refreshPortfolio: fetchPortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
