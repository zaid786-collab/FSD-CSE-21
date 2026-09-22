import React, { useState } from 'react';
import { ArrowUpRight, X, CheckCircle } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const purposeOptions = [
  'Internship',
  'Full-time Opportunity',
  'Freelance',
  'Project Collaboration',
  'Hackathon or Open Source',
  'General Inquiry'
];

export function Contact() {
  const { portfolioData } = usePortfolio();
  const profile = portfolioData?.profile || {};
  const publicEmail = profile.publicEmail || profile.email || 'zaidkhan24082006@gmail.com';
  const availabilityStatement = profile.availabilityStatement || 'Open to software engineering roles, off-campus internships, and freelance projects. Reach out directly or dispatch a note below.';
  const contactFormEnabled = profile.contactFormEnabled !== false;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    purpose: 'Internship',
    subject: '',
    message: '',
    website_hp: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus({
        submitting: false,
        success: false,
        error: 'Please fill in required fields (Name, Email, Subject, Message).'
      });
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to dispatch message.');
      }

      setStatus({ submitting: false, success: true, error: null });
      setSuccessMessage(json.message || '');
      setShowSuccessModal(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        purpose: 'Internship',
        subject: '',
        message: '',
        website_hp: ''
      });
    } catch (err) {
      setStatus({
        submitting: false,
        success: false,
        error: err.message || 'An error occurred. You can reach out directly via email.'
      });
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-[#232320]">
      <div className="max-w-4xl mx-auto">
        {/* Editorial Header */}
        <div className="mb-16">
          <div className="font-mono text-xs tracking-wider uppercase text-[#D4AF37] flex items-center gap-2 mb-4">
            <span>09</span>
            <span className="text-[#3A3A34]">—</span>
            <span>Contact & Inquiries</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#EDEDEB] mb-4">
            Have a project, opportunity, or inquiry?
          </h2>
          <p className="text-sm text-[#9E9E96] max-w-xl leading-relaxed">
            {availabilityStatement}
          </p>
          <div className="mt-4">
            <a
              href={`mailto:${publicEmail}`}
              className="font-mono text-sm text-[#D4AF37] hover:text-[#E6C65C] transition-colors underline decoration-[#D4AF37]/40 underline-offset-4"
            >
              {publicEmail}
            </a>
          </div>
        </div>

        {/* Contact Form */}
        {contactFormEnabled ? (
        <div className="p-8 sm:p-10 rounded bg-[#11110F] border border-[#232320]">
          {status.error && (
            <div className="p-4 rounded bg-[#171713] border border-red-500/30 text-red-300 text-xs font-mono mb-6">
              {status.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Honeypot hidden input */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website_hp}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-xs font-mono text-[#9E9E96] mb-2">
                  Name <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] placeholder:text-[#5A5A52] focus-visible:outline-none focus-visible:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono text-[#9E9E96] mb-2">
                  Email Address <span className="text-[#D4AF37]">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@domain.com"
                  className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] placeholder:text-[#5A5A52] focus-visible:outline-none focus-visible:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-xs font-mono text-[#9E9E96] mb-2">
                  Organization / Company <span className="text-[#5A5A52]">(optional)</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] placeholder:text-[#5A5A52] focus-visible:outline-none focus-visible:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="purpose" className="block text-xs font-mono text-[#9E9E96] mb-2">
                  Inquiry Purpose <span className="text-[#D4AF37]">*</span>
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] focus-visible:outline-none focus-visible:border-[#D4AF37] transition-colors"
                >
                  {purposeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#11110F] text-[#EDEDEB]">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-mono text-[#9E9E96] mb-2">
                Subject <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject of inquiry"
                className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] placeholder:text-[#5A5A52] focus-visible:outline-none focus-visible:border-[#D4AF37] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-mono text-[#9E9E96] mb-2">
                Message <span className="text-[#D4AF37]">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Details of the opportunity or message..."
                className="w-full px-3.5 py-2.5 rounded bg-[#0B0B0A] border border-[#232320] text-xs text-[#EDEDEB] placeholder:text-[#5A5A52] focus-visible:outline-none focus-visible:border-[#D4AF37] transition-colors resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={status.submitting}
              className="w-full sm:w-auto px-6 py-3 rounded bg-[#EDEDEB] hover:bg-white text-[#0B0B0A] font-mono text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]"
            >
              {status.submitting ? (
                <span>Transmitting message...</span>
              ) : (
                <>
                  <span>Transmit Inquiry</span>
                  <ArrowUpRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
        ) : (
          <div className="p-8 rounded bg-[#11110F] border border-[#232320] text-center font-mono text-xs text-[#9E9E96]">
            <p className="mb-3">Web contact intake form is currently offline for direct inquiries.</p>
            <p>Please dispatch notes directly to: <a href={`mailto:${publicEmail}`} className="text-[#D4AF37] underline">{publicEmail}</a></p>
          </div>
        )}
      </div>

      {/* Minimalist Confirmation Modal */}
      {showSuccessModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setShowSuccessModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowSuccessModal(false)}
        >
          <div
            className="bg-[#11110F] border border-[#232320] p-8 rounded max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-[#9E9E96] hover:text-[#EDEDEB] p-1"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="mb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#D4AF37] block mb-1">
                Receipt Acknowledged
              </span>
              <h3 className="text-xl font-serif font-bold text-[#EDEDEB]">
                Message Delivered
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#9E9E96] leading-relaxed mb-6">
              {successMessage || 'Thank you for reaching out. Your note has been securely stored and an automatic receipt confirmation has been dispatched to your email address. I will review your inquiry and follow up shortly.'}
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 rounded bg-[#171713] hover:bg-[#1D1D18] text-[#EDEDEB] border border-[#232320] text-xs font-mono transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
