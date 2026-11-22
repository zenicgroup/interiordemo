import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Maximize2, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { EDITORIAL_EASE, EditorialReveal } from '../components/EditorialMotion';
import { LightboxModal } from '../components/LightboxModal';
import { useDocumentSeo, useStudio } from '../context/StudioContext';

export function ProjectsPage() {
  useDocumentSeo('/projects', 'Selected Works | Sorel Spaces Portfolio');
  const { projects, categories } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = projects.filter((p) => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const q = query.trim().toLowerCase();
    const matchQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.shortDescription.toLowerCase().includes(q);
    return matchCategory && matchQuery;
  });

  const lightboxItems = filtered.map((p) => ({
    src: p.heroImage,
    caption: p.title,
    subtitle: `${p.location} · ${p.category} · ${p.year}`,
  }));

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-10 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Portfolio Archive</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-light text-balance">
              Selected Architectural & Interior Commissions
            </h1>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Each residence, coastal pavilion, and workspace is shaped around natural light, structural clarity, and honest quarried materials.
            </p>
            <div className="flex items-center border-b border-[#252521]/30 focus-within:border-[#252521] transition-colors">
              <Search className="w-4 h-4 text-[#252521]/50 mr-2.5 shrink-0" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by project, city, or material..."
                aria-label="Search portfolio projects"
                className="w-full bg-transparent py-2.5 text-sm focus:outline-none placeholder:text-[#252521]/45"
              />
            </div>
          </div>
        </EditorialReveal>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-5" role="tablist" aria-label="Filter projects">
            {['All', ...categories].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative text-xs tracking-[0.16em] uppercase pb-2 transition-colors cursor-pointer ${
                    active ? 'text-[#252521] font-medium' : 'text-[#252521]/55 hover:text-[#252521]'
                  }`}
                >
                  <span>{cat}</span>
                  {active && (
                    <motion.span
                      layoutId="projectsArchiveFilterLine"
                      transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                      className="absolute inset-x-0 bottom-0 h-px bg-[#252521]"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-[#252521]/60 tabular-nums">
            Showing {filtered.length} {filtered.length === 1 ? 'commission' : 'commissions'}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center border border-[#252521]/15 bg-[#FFFFFF]/50 space-y-4">
            <p className="font-serif text-2xl">No projects match your current filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setQuery('');
              }}
              className="px-6 py-2.5 border border-[#252521] text-xs tracking-[0.16em] uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {filtered.map((project, idx) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.65, delay: (idx % 3) * 0.08, ease: EDITORIAL_EASE }}
                className="group flex flex-col"
              >
                <div className="relative overflow-hidden mb-5">
                  <Link to={`/projects/${project.slug}`} className="block">
                    <ArchitecturalImage
                      src={project.heroImage}
                      alt={project.title}
                      aspectClassName="aspect-[4/3]"
                      className="group-hover:scale-[1.035]"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Open ${project.title} plate`}
                    className="absolute top-3.5 right-3.5 w-9 h-9 bg-[#F4F1EA]/90 text-[#252521] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#252521] hover:text-[#F4F1EA] cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#A69B8B] mb-2 tabular-nums">
                  <span>{project.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <Link to={`/projects/${project.slug}`}>
                    <h2 className="font-serif text-2xl md:text-3xl group-hover:text-[#A69B8B] transition-colors">
                      {project.title}
                    </h2>
                  </Link>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] tracking-[0.16em] uppercase shrink-0"
                  >
                    <span>Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                <p className="text-sm text-[#252521]/70 leading-relaxed mt-2">
                  {project.shortDescription}
                </p>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <LightboxModal
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
