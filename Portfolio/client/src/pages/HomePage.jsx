import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BackToTop } from '../components/layout/BackToTop';
import { Hero } from '../components/home/Hero';
import { About } from '../components/home/About';
import { Skills } from '../components/home/Skills';
import { Projects } from '../components/home/Projects';
import { Journey } from '../components/home/Journey';
import { CompetitiveProgramming } from '../components/home/CompetitiveProgramming';
import { Certifications } from '../components/home/Certifications';
import { GithubSection } from '../components/home/GithubSection';
import { ResumeSection } from '../components/home/ResumeSection';
import { Contact } from '../components/home/Contact';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#EDEDEB] flex flex-col justify-between">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <CompetitiveProgramming />
        <Certifications />
        <GithubSection />
        <ResumeSection />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
