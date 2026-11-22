import { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { EDITORIAL_EASE, EditorialReveal } from '../components/EditorialMotion';
import { useDocumentSeo, useStudio } from '../context/StudioContext';
import type { TeamMember } from '../types/studio';

const DISCIPLINES = ['All', 'Architecture', 'Design', 'Project Management', 'Technical'] as const;

export function TeamPage() {
  useDocumentSeo('/team', 'Our Team | Sorel Spaces');
  const { team } = useStudio();
  const [filter, setFilter] = useState<string>('All');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filtered = filter === 'All' ? team : team.filter((m) => m.discipline === filter);

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-14">
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-10 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Studio Expertise</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-light text-balance">
              Architects, Interior Designers & Technical Specialists
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Our multidisciplinary practice unites licensed architects, interior material curators, lighting designers, and turnkey construction directors across New York, London, and Milan.
            </p>
          </div>
        </EditorialReveal>

        <div className="flex flex-wrap items-center gap-5" role="tablist" aria-label="Filter team by discipline">
          {DISCIPLINES.map((disc) => {
            const active = filter === disc;
            return (
              <button
                key={disc}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(disc)}
                className={`relative text-xs tracking-[0.16em] uppercase pb-2 transition-colors cursor-pointer ${
                  active ? 'text-[#252521] font-medium' : 'text-[#252521]/55 hover:text-[#252521]'
                }`}
              >
                <span>{disc}</span>
                {active && (
                  <motion.span
                    layoutId="teamFilterUnderline"
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    className="absolute inset-x-0 bottom-0 h-px bg-[#252521]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {filtered.map((member, idx) => (
            <motion.article
              key={member.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: (idx % 3) * 0.08, ease: EDITORIAL_EASE }}
              className="group flex flex-col space-y-4"
            >
              <button
                type="button"
                onClick={() => setSelectedMember(member)}
                className="text-left block w-full cursor-pointer"
              >
                <ArchitecturalImage
                  src={member.image}
                  alt={member.name}
                  aspectClassName="aspect-[3/4]"
                  className="group-hover:scale-[1.025]"
                />
              </button>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-[#A69B8B]">
                  <span>{member.discipline}</span>
                  <span aria-hidden="true">·</span>
                  <span>{member.location}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl">{member.name}</h2>
                <p className="text-xs tracking-[0.14em] uppercase text-[#252521]/65">{member.role}</p>
                <p className="text-xs text-[#252521]/55">{member.credentials}</p>
                <p className="text-sm text-[#252521]/75 leading-relaxed pt-2">{member.bio}</p>
                <button
                  type="button"
                  onClick={() => setSelectedMember(member)}
                  className="pt-2 text-[11px] tracking-[0.16em] uppercase underline underline-offset-4 hover:text-[#A69B8B] cursor-pointer"
                >
                  Read Full Dossier
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EDITORIAL_EASE }}
            className="fixed inset-0 z-50 bg-[#252521]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={selectedMember.name}
          >
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.985 }}
              transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
              className="bg-[#F4F1EA] text-[#252521] max-w-3xl w-full grid grid-cols-1 md:grid-cols-12 overflow-hidden border border-[#252521]/20"
            >
              <div className="md:col-span-5">
                <ArchitecturalImage
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  aspectClassName="aspect-[3/4] h-full"
                />
              </div>
              <div className="md:col-span-7 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#A69B8B]">
                        {selectedMember.discipline} · {selectedMember.location}
                      </p>
                      <h3 className="font-serif text-3xl mt-1">{selectedMember.name}</h3>
                      <p className="text-xs tracking-[0.14em] uppercase text-[#252521]/65 mt-1">
                        {selectedMember.role}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedMember(null)}
                      className="p-2 border border-[#252521]/20 hover:bg-[#252521] hover:text-[#F4F1EA] cursor-pointer"
                      aria-label="Close specialist dossier"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#252521]/60 border-y border-[#252521]/10 py-2.5">
                    Credentials: {selectedMember.credentials}
                  </p>
                  <p className="text-sm text-[#252521]/80 leading-relaxed">{selectedMember.bio}</p>
                </div>
                <p className="text-xs text-[#252521]/60">
                  Direct studio enquiries: commissions@sorelspaces.com
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
