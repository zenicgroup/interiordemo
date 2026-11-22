import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { EDITORIAL_EASE } from './EditorialMotion';

interface LightboxItem {
  src: string;
  caption?: string;
  subtitle?: string;
}

interface LightboxModalProps {
  items: LightboxItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function LightboxModal({ items, activeIndex, onClose, onNavigate }: LightboxModalProps) {
  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((activeIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((activeIndex - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, items.length, onClose, onNavigate]);

  const current = activeIndex !== null ? items[activeIndex] : null;

  return (
    <AnimatePresence>
      {activeIndex !== null && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
          className="fixed inset-0 z-50 bg-[#252521]/95 backdrop-blur-sm flex flex-col justify-between p-6 md:p-10 text-[#F4F1EA]"
          role="dialog"
          aria-modal="true"
          aria-label="Architectural image viewer"
        >
          <div className="flex items-center justify-between border-b border-[#F4F1EA]/15 pb-4">
            <div className="flex items-center gap-3 text-xs tracking-[0.18em] uppercase text-[#D9CCB8] tabular-nums">
              <span>
                {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </span>
              {current.subtitle && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{current.subtitle}</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#F4F1EA]/25 text-xs tracking-[0.16em] uppercase hover:bg-[#F4F1EA] hover:text-[#252521] transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-6 min-h-0">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
                className="hidden md:flex items-center justify-center w-12 h-12 border border-[#F4F1EA]/20 hover:bg-[#F4F1EA] hover:text-[#252521] transition-colors mr-6 shrink-0 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                className="max-h-full max-w-5xl w-full flex items-center justify-center"
              >
                <img
                  src={current.src}
                  alt={current.caption || 'Architectural plate'}
                  referrerPolicy="no-referrer"
                  className="max-h-[72vh] w-auto object-contain shadow-2xl"
                />
              </motion.div>
            </AnimatePresence>

            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onNavigate((activeIndex + 1) % items.length)}
                className="hidden md:flex items-center justify-center w-12 h-12 border border-[#F4F1EA]/20 hover:bg-[#F4F1EA] hover:text-[#252521] transition-colors ml-6 shrink-0 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#F4F1EA]/15">
            <p className="font-serif text-xl md:text-2xl text-[#F4F1EA]">{current.caption}</p>
            {items.length > 1 && (
              <div className="flex md:hidden items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
                  className="p-2.5 border border-[#F4F1EA]/25"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate((activeIndex + 1) % items.length)}
                  className="p-2.5 border border-[#F4F1EA]/25"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
