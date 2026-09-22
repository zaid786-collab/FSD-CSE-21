import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-2.5 rounded bg-[#171713] text-[#9E9E96] hover:text-[#D4AF37] border border-[#232320] hover:border-[#D4AF37]/50 shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} />
    </button>
  );
}
