import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../components/common/Icons';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const staticProjects = {
  'intervista-ai': {
    name: 'Intervista AI',
    slug: 'intervista-ai',
    tagline: 'Next-Generation AI-Powered Technical Interview & Career Assessment Platform',
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/Intervista-AI.git',
    liveDemoUrl: null,
    techStack: ['React 18', 'FastAPI', 'Python 3.10+', 'Vite', 'Large Language Models', 'Tailwind CSS'],
    problemStatement: 'Technical job seekers struggle to bridge the gap between static algorithmic practice (e.g. solving LeetCode problems in isolation) and realistic engineering interviews where real-time articulation, dynamic code explaining, and adaptive interviewer follow-ups are evaluated under pressure.',
    solution: 'Engineered an end-to-end technical interview simulation platform that pairs LLM intelligence with multimodal audio and video stream analysis. Intervista AI creates an interactive code sandbox with dynamic question generation, live speech-to-text transcript alignment, and automated ATS resume matching.',
    features: [
      'Adaptive AI Interviewer: Dynamically asks clarifying questions based on candidate responses, code modifications, and edge-case handling.',
      'Multimodal Video & Speech Feedback: Analyzes vocal confidence, speech clarity, pacing, and engagement during the interview.',
      'Live In-Browser Coding Sandbox: Multi-language syntax highlighting with automated test execution against standard and hidden test cases.',
      'Algorithmic Complexity Evaluation: Provides detailed time/space complexity analysis and highlights alternative optimal approaches.',
      'AI Resume Analyzer & ATS Match Scoring: Extracts key skills and computes ATS compatibility against target job descriptions.',
      'Dynamic Assessment Reports: Automated generation of structured rubric reports with transcripts and actionable feedback.'
    ],
    architecture: 'FastAPI asynchronous backend with Python AI pipelines and LLM orchestration, coupled with a high-performance React frontend and dynamic sandbox execution engine.',
    challenges: [
      'Achieving low-latency synchronization between candidate audio streaming, speech-to-text conversion, and LLM question generation.',
      'Isolating candidate code execution in secure runner environments with memory and CPU boundaries.'
    ]
  },
  'crime-lens': {
    name: 'Crime Lens',
    slug: 'crime-lens',
    tagline: 'Cybernetic Crime Investigation & Intelligence Analytics Platform',
    role: 'Project Leader',
    githubUrl: 'https://github.com/mayankkotuli099/Crime-Lens.git',
    liveDemoUrl: null,
    techStack: ['React 19', 'Vite', 'Network Graph Visualization', 'JavaScript', 'CSS3'],
    problemStatement: 'Modern forensic and digital intelligence investigators encounter fragmented silos of intercepted communications, cross-border financial transactions, and dark web signals. Tracing complex syndicate networks across disconnected databases creates critical analytical delays.',
    solution: 'Designed CrimeLens to unify disparate intelligence streams into a tactical live operations dashboard. The platform features an interactive Network Nexus graph, multi-source chronological timelines, and Entity 360 dossiers for automated identity resolution.',
    features: [
      'Tactical Live Telemetry: Active monitoring of suspicious entities, relationships, threat levels, and active cases.',
      'Interactive Network Nexus Graph: Multi-hop visual association tracing suspect nodes, shell companies, burner phones, and financial accounts.',
      'Chronological Event Timeline: Integrated timeline combining intercepted messages, transactions, and location check-ins with anomaly spike detection.',
      'Entity 360 Dossier: AI-driven resolution merging proxy accounts, burner numbers, and aliases into unified threat dossiers.',
      'Cryptographic Evidence Sealing: Digital signature verification to ensure strict chain of custody standards.',
      'Neural Investigation Copilot: Natural language intelligence query interface for conversational forensic queries.'
    ],
    architecture: 'Reactive modular frontend with interactive graph-based visualization layers and optimized state telemetry pipelines.',
    challenges: [
      'Rendering dense multi-node relationship graphs with interactive pan, zoom, and clustering at 60fps.',
      'Standardizing heterogeneous forensic data into a cohesive chronological event schema.'
    ]
  },
  'smart-stocks': {
    name: 'Smart Stocks',
    slug: 'smart-stocks',
    tagline: 'AI-Powered Investment Intelligence Platform',
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/Smart-Stocks.git',
    liveDemoUrl: null,
    techStack: ['React', 'Vite', 'Lucide React', 'Tailwind CSS', 'PostCSS'],
    problemStatement: 'Retail market participants face an overwhelming volume of market noise, unstructured corporate disclosures, and volatile pricing data, making it difficult to perform structured risk-adjusted portfolio analysis.',
    solution: 'Smart Stocks unifies quantitative market data, predictive indicator modeling, and financial health screening into a clean, modern dashboard.',
    features: [
      'Real-Time Market Telemetry: High-resolution market feeds and predictive indicator modeling.',
      'Algorithmic Trend Analysis: Statistical risk distribution matrices and momentum indicators.',
      'Company Health Insights: Fundamental metrics and financial ratio evaluation.',
      'AI-Powered Stock Screening: Automated filtering based on user risk profiles and technical criteria.'
    ],
    architecture: 'Component-driven frontend optimized for rapid data parsing, modular indicator widgets, and responsive charting.',
    challenges: [
      'Handling real-time price updates while keeping UI renders smooth and memory footprint minimal.'
    ]
  },
  'salesforce-clone': {
    name: 'Salesforce Clone',
    slug: 'salesforce-clone',
    tagline: 'Enterprise CRM Landing Architecture & Interactive Platform Clone',
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/Salesforce-Clone.git',
    liveDemoUrl: null,
    techStack: ['HTML5', 'CSS3', 'JavaScript'],
    problemStatement: 'Understanding enterprise web standards, responsive layout complexity, and commercial landing page user flows by building a production-faithful implementation of Salesforce.',
    solution: 'Engineered a full-fidelity CRM web portal featuring enterprise-grade multi-tier navigation, interactive product catalogs, customer success story showcases, and lead generation workflows.',
    features: [
      'Multi-Tiered Navigation: Complex enterprise header navigation with responsive mobile menu drawers.',
      'Product Matrix Showcase: Interactive service comparison and platform capability grids.',
      'Lead Generation Intake: Structured customer inquiry forms with client-side field validation.',
      'Pixel-Perfect Responsive Layout: Comprehensive breakpoints tailored from mobile to wide screens.'
    ],
    architecture: 'Modular semantic HTML5 structure with custom CSS Grid/Flexbox architecture and vanilla JavaScript event handling.',
    challenges: [
      'Faithfully recreating complex nested dropdown menus and mobile drawer states without framework dependencies.'
    ]
  },
  'developer-portfolio': {
    name: 'Developer Portfolio Rebuild',
    slug: 'developer-portfolio',
    tagline: 'Production-Grade Software Engineer Showcase & Content System',
    role: 'Project Leader',
    githubUrl: 'https://github.com/zaid786-collab/My-Portfolio.git',
    liveDemoUrl: null,
    techStack: ['React 19', 'Vite', 'Tailwind CSS v4', 'Node.js', 'Express', 'MongoDB'],
    problemStatement: 'Generic developer portfolio templates lack real full-stack depth, fail to demonstrate data architecture or security best practices, and rely on static mock data.',
    solution: 'Built an authentic full-stack web application featuring dark-mode developer aesthetics, Express REST API, MongoDB persistence, CSRF/rate-limited endpoints, and a protected administrative CMS.',
    features: [
      'Editorial Dark + Gold Aesthetic: Understated design with warm charcoal surfaces, restrained gold accents, and thoughtful typography.',
      'Dedicated Case Studies: In-depth project breakdowns highlighting verified engineering decisions.',
      'Resilient Dynamic Stats: Public GitHub API and CP metrics with automatic fallback caching.',
      'Spam-Protected Contact API: Honeypot trap, IP rate limiting, input sanitization, and dual email dispatch.',
      'Protected Admin CMS: Server-locked authentication, draft/publish workflows, autosave, and safe soft deletion.',
      'Strict Accessibility & Performance: Clean semantic HTML, high contrast ratios, and prefers-reduced-motion support.'
    ],
    architecture: 'Decoupled full-stack architecture with React client SPA, Express REST API, MongoDB Atlas, and environment-isolated security policies.',
    challenges: [
      'Enforcing strict zero-hallucination verification across all project datasets while maintaining high dynamic responsiveness.'
    ]
  }
};

export function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProject(json.data);
            return;
          }
        }
      } catch (err) {
        // Use static fallback
      }
      setProject(staticProjects[slug] || null);
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-[#0B0B0A] flex items-center justify-center text-[#9E9E96] font-mono text-xs">
        Loading case study...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0B0A] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-xl font-serif font-bold text-[#EDEDEB] mb-2">Project Not Located</h1>
        <p className="text-xs font-mono text-[#9E9E96] mb-6">The requested case study was not found.</p>
        <Link to="/" className="px-4 py-2 rounded bg-[#171713] text-[#EDEDEB] border border-[#232320] text-xs font-mono">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0A] text-[#EDEDEB] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#9E9E96] hover:text-[#EDEDEB] transition-colors mb-10"
        >
          <ArrowLeft size={13} />
          <span>Back to Portfolio</span>
        </Link>

        {/* Case Study Header */}
        <div className="mb-14 pb-8 border-b border-[#232320]">
          <div className="flex items-center gap-2 font-mono text-xs text-[#D4AF37] mb-3">
            <span>Case Study</span>
            <span className="text-[#3A3A34]">·</span>
            <span>Role: {project.role || 'Project Leader'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#EDEDEB] tracking-tight mb-4">
            {project.name}
          </h1>

          <p className="text-base sm:text-lg text-[#9E9E96] leading-relaxed mb-8 max-w-2xl font-serif italic">
            {project.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#11110F] border border-[#232320] hover:border-[#D4AF37]/50 text-xs font-mono text-[#EDEDEB] transition-colors"
              >
                <GithubIcon size={14} />
                <span>GitHub Repository</span>
                <ExternalLink size={10} className="text-[#5A5A52]" />
              </a>
            )}

            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#D4AF37] hover:bg-[#E6C65C] text-[#0B0B0A] text-xs font-mono font-medium transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>

        {/* Narrative Sections */}
        <div className="space-y-14">
          {/* Tech Stack */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] block mb-3">
              Technologies & Infrastructure
            </span>
            <div className="flex flex-wrap gap-2">
              {project.techStack?.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded text-xs font-mono text-[#EDEDEB] bg-[#11110F] border border-[#232320]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Problem Statement */}
          {project.problemStatement && (
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] block">
                Problem Statement
              </span>
              <p className="text-sm text-[#9E9E96] leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
          )}

          {/* Solution & Architecture */}
          {project.solution && (
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] block">
                Solution & Implementation
              </span>
              <p className="text-sm text-[#9E9E96] leading-relaxed">
                {project.solution}
              </p>
              {project.architecture && (
                <div className="p-4 rounded bg-[#11110F] border border-[#232320] text-xs font-mono text-[#9E9E96] mt-4">
                  <span className="text-[#EDEDEB] font-semibold block mb-1">Architecture Details:</span>
                  {project.architecture}
                </div>
              )}
            </div>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] block">
                Key Features
              </span>
              <div className="space-y-2.5">
                {project.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#9E9E96]">
                    <span className="text-[#D4AF37] font-mono mt-0.5">•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] block">
                Technical Challenges
              </span>
              <div className="space-y-2.5">
                {project.challenges.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[#9E9E96] font-mono">
                    <span className="text-[#D4AF37] font-mono mt-0.5">[{i + 1}]</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
