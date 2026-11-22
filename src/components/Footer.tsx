import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

export function Footer() {
  const { siteContent, projects } = useStudio();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return;
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Unable to subscribe.');
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to subscribe.');
    }
  };

  return (
    <footer className="bg-[#252521] text-[#F4F1EA] border-t border-[#D9CCB8]/15">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#F4F1EA]/15">
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block font-serif text-2xl tracking-[0.14em] uppercase">
              {siteContent.brandName}
            </Link>
            <p className="font-serif italic text-xl text-[#D9CCB8]">{siteContent.tagline}</p>
            <p className="text-sm text-[#F4F1EA]/70 leading-relaxed max-w-sm">
              International interior architecture and design practice crafting enduring residences, workspaces, and coastal villas across New York, London, and Milan.
            </p>
            <div className="pt-2 text-xs text-[#D9CCB8] space-y-1">
              <p>{siteContent.headquarters}</p>
              <p>
                {siteContent.studioEmail} · {siteContent.studioPhone}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#A69B8B]">Practice</p>
            <ul className="space-y-2.5 text-sm text-[#F4F1EA]/80">
              <li>
                <Link to="/about" className="hover:text-[#D9CCB8] transition-colors">
                  About Studio
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#D9CCB8] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/services/residential" className="hover:text-[#D9CCB8] transition-colors">
                  Residential Interiors
                </Link>
              </li>
              <li>
                <Link to="/services/commercial" className="hover:text-[#D9CCB8] transition-colors">
                  Commercial Interiors
                </Link>
              </li>
              <li>
                <Link to="/services/architecture" className="hover:text-[#D9CCB8] transition-colors">
                  Architecture
                </Link>
              </li>
              <li>
                <Link to="/services/turnkey" className="hover:text-[#D9CCB8] transition-colors">
                  Turnkey Solutions
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#A69B8B]">Selected Works</p>
            <ul className="space-y-2.5 text-sm text-[#F4F1EA]/80">
              {projects.slice(0, 6).map((project) => (
                <li key={project.id}>
                  <Link to={`/projects/${project.slug}`} className="hover:text-[#D9CCB8] transition-colors">
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <p className="text-[11px] tracking-[0.18em] uppercase text-[#A69B8B]">Studio Dispatch</p>
            <p className="text-sm text-[#F4F1EA]/70 leading-relaxed">
              Seasonal monographs, newly completed architectural plates, and material notes.
            </p>
            {subscribed ? (
              <p className="text-xs tracking-[0.14em] uppercase text-[#D9CCB8] py-3 border-b border-[#D9CCB8]/40">
                Thank you. You are subscribed to Sorel Dispatch.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex items-center border-b border-[#F4F1EA]/30 focus-within:border-[#F4F1EA] transition-colors">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    aria-label="Newsletter email address"
                    className="w-full bg-transparent py-3 text-sm text-[#F4F1EA] placeholder:text-[#F4F1EA]/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 text-[#D9CCB8] hover:text-[#FFFFFF] cursor-pointer"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {error && <p className="text-xs text-[#D9CCB8]">{error}</p>}
              </form>
            )}

            <div className="pt-4 flex flex-wrap gap-5 text-xs tracking-[0.14em] uppercase text-[#A69B8B]">
              <Link to="/team" className="hover:text-[#F4F1EA] transition-colors">
                Team
              </Link>
              <Link to="/process" className="hover:text-[#F4F1EA] transition-colors">
                Process
              </Link>
              <Link to="/journal" className="hover:text-[#F4F1EA] transition-colors">
                Journal
              </Link>
              <Link to="/contact" className="hover:text-[#F4F1EA] transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A69B8B]">
          <p>© {new Date().getFullYear()} Sorel Spaces Architecture & Interior Design. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>New York · London · Milan</span>
            <Link to="/admin" className="hover:text-[#F4F1EA] transition-colors underline underline-offset-4">
              Studio Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
