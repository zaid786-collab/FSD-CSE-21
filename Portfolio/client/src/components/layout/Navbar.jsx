import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandMark } from '../common/BrandMark';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Works', href: '#projects' },
  { label: 'DSA / CP', href: '#competitive-programming' },
  { label: 'Journey', href: '#experience' },
  { label: 'Credentials', href: '#certifications' },
  { label: 'Contact', href: '#contact' }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

    const sections = navItems.map(item => document.querySelector(item.href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [isHomePage]);

  const handleNavClick = (e, href) => {
    setMobileMenuOpen(false);
    if (!isHomePage) return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b ${
          scrolled
            ? 'bg-[#0B0B0A]/95 backdrop-blur-sm border-[#232320] py-3.5'
            : 'bg-[#0B0B0A]/80 border-transparent py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]">
            <BrandMark size={28} showText={false} />
            <span className="font-mono text-xs font-semibold tracking-wider text-[#EDEDEB] group-hover:text-[#D4AF37] transition-colors">
              MOHAMMAD ZAID KHAN
            </span>
          </Link>

          {/* Minimalist Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = isHomePage && activeSection === sectionId;
              return (
                <a
                  key={item.label}
                  href={isHomePage ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative text-xs font-mono tracking-wide transition-colors duration-150 py-1 focus-visible:outline-none focus-visible:text-[#D4AF37] ${
                    isActive
                      ? 'text-[#EDEDEB] font-medium'
                      : 'text-[#9E9E96] hover:text-[#EDEDEB]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D4AF37]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action: Understated Resume Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/Mohammad_Zaid_Khan_Resume.pdf"
              download="Mohammad_Zaid_Khan_Resume.pdf"
              className="px-3.5 py-1.5 rounded text-xs font-mono font-medium text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            >
              Resume PDF
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#9E9E96] hover:text-[#EDEDEB] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Clean Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/70" onClick={() => setMobileMenuOpen(false)}>
          <nav
            className="fixed top-14 left-0 right-0 bg-[#11110F] border-b border-[#232320] p-6 shadow-xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={isHomePage ? item.href : `/${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-mono text-[#EDEDEB] hover:text-[#D4AF37] transition-colors py-1 flex items-center justify-between border-b border-[#1D1D1A]"
              >
                <span>{item.label}</span>
                <ArrowUpRight size={14} className="text-[#9E9E96]" />
              </a>
            ))}
            <a
              href="/Mohammad_Zaid_Khan_Resume.pdf"
              download="Mohammad_Zaid_Khan_Resume.pdf"
              className="mt-2 text-center py-2.5 rounded text-xs font-mono font-medium text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 transition-colors"
            >
              Download Resume (PDF)
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
