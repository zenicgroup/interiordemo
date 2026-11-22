import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useStudio } from '../context/StudioContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Services', to: '/services' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const { siteContent } = useStudio();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHomeHero = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isHomeHero
            ? 'bg-transparent text-[#FFFFFF] border-b border-[#FFFFFF]/15'
            : 'bg-[#F4F1EA]/95 backdrop-blur-md text-[#252521] border-b border-[#252521]/10'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-16 md:h-[72px] flex items-center justify-between gap-8">
          <Link
            to="/"
            className="font-serif text-xl md:text-2xl tracking-[0.14em] uppercase whitespace-nowrap shrink-0 font-normal"
          >
            {siteContent.brandName}
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary navigation">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-[12px] tracking-[0.16em] uppercase whitespace-nowrap shrink-0 py-1 border-b transition-colors ${
                    isActive
                      ? isHomeHero
                        ? 'border-[#FFFFFF] text-[#FFFFFF]'
                        : 'border-[#252521] text-[#252521]'
                      : isHomeHero
                      ? 'border-transparent text-[#FFFFFF]/80 hover:text-[#FFFFFF]'
                      : 'border-transparent text-[#252521]/70 hover:text-[#252521]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/start-project"
              className={`hidden sm:inline-flex items-center px-5 py-2.5 text-[11px] tracking-[0.18em] uppercase border transition-colors whitespace-nowrap shrink-0 ${
                isHomeHero
                  ? 'border-[#FFFFFF]/55 text-[#FFFFFF] hover:bg-[#FFFFFF] hover:text-[#252521]'
                  : 'border-[#252521] text-[#252521] hover:bg-[#252521] hover:text-[#F4F1EA]'
              }`}
            >
              Start a Project
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -mr-2 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#252521] text-[#F4F1EA] flex flex-col justify-between p-6 sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between border-b border-[#F4F1EA]/15 pb-5">
            <span className="font-serif text-xl tracking-[0.14em] uppercase">{siteContent.brandName}</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 my-auto py-8">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-serif text-3xl sm:text-4xl text-[#F4F1EA] hover:text-[#D9CCB8] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-[#F4F1EA]/15 flex flex-col gap-3 text-xs tracking-[0.16em] uppercase text-[#D9CCB8]">
              <Link to="/team">Our Team</Link>
              <Link to="/process">Design Process</Link>
              <Link to="/admin">Studio Admin</Link>
            </div>
          </nav>

          <Link
            to="/start-project"
            className="w-full py-4 text-center bg-[#F4F1EA] text-[#252521] text-xs tracking-[0.18em] uppercase"
          >
            Start a Project
          </Link>
        </div>
      )}
    </>
  );
}
