import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Maximize2 } from 'lucide-react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { LightboxModal } from '../components/LightboxModal';
import { useDocumentSeo, useStudio } from '../context/StudioContext';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = useStudio();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const project = projects.find((p) => p.slug === slug) || projects[0];
  useDocumentSeo(
    `/projects/${project?.slug || ''}`,
    project ? `${project.title} | Sorel Spaces` : 'Project Case Study | Sorel Spaces',
    project?.shortDescription
  );

  if (!project) {
    return (
      <div className="pt-36 pb-24 max-w-[1440px] mx-auto px-6 text-center space-y-4">
        <h1 className="font-serif text-4xl">Project Not Found</h1>
        <Link to="/projects" className="inline-block border-b border-[#252521] text-xs uppercase tracking-widest">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const related = projects.filter((p) => p.id !== project.id).slice(0, 3);
  const allPlates = [project.heroImage, ...project.gallery.filter((g) => g !== project.heroImage)];
  const lightboxItems = allPlates.map((src, i) => ({
    src,
    caption: `${project.title} — Plate ${String(i + 1).padStart(2, '0')}`,
    subtitle: `${project.location} · ${project.year}`,
  }));

  return (
    <article className="bg-[#F4F1EA] text-[#252521]">
      {/* Full-Width Hero */}
      <section className="relative min-h-[78vh] w-full bg-[#252521] text-[#FFFFFF] flex flex-col justify-end pt-28 pb-14 overflow-hidden">
        <img
          src={project.heroImage}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#191916]/85 via-[#191916]/35 to-[#191916]/30" />

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 space-y-5">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#D9CCB8] hover:text-[#FFFFFF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Projects</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.16em] uppercase text-[#D9CCB8] tabular-nums">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.location}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>

          <h1 className="font-serif text-[clamp(2.75rem,5.5vw,5rem)] leading-[1.02] font-light max-w-4xl text-balance">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Architectural Dossier */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24 border-b border-[#252521]/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-14 mb-14 border-b border-[#252521]/15">
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B] mb-1">Location</p>
            <p className="text-sm font-medium">{project.location}</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B] mb-1">Discipline</p>
            <p className="text-sm font-medium">{project.category}</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B] mb-1">Floor Area</p>
            <p className="text-sm font-medium tabular-nums">{project.area}</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B] mb-1">Timeline & Year</p>
            <p className="text-sm font-medium tabular-nums">
              {project.duration} · {project.year}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Project Overview</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light leading-snug text-balance">
              {project.shortDescription}
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-8 text-base text-[#252521]/80 leading-relaxed">
            <p>{project.overview}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#252521]/15">
              <div className="space-y-2">
                <h3 className="text-xs tracking-[0.18em] uppercase text-[#252521] font-semibold">
                  Design Challenges
                </h3>
                <p className="text-sm text-[#252521]/75 leading-relaxed">{project.challenges}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs tracking-[0.18em] uppercase text-[#252521] font-semibold">
                  Architectural Approach
                </h3>
                <p className="text-sm text-[#252521]/75 leading-relaxed">{project.approach}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Material Selection & Colour Palette */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24 border-b border-[#252521]/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Material Specification</p>
            <h2 className="font-serif text-3xl font-light">Curated Finishes & Joinery</h2>
            <ul className="divide-y divide-[#252521]/15 border-y border-[#252521]/15">
              {project.materials.map((mat, i) => (
                <li key={mat} className="py-3.5 flex items-center justify-between text-sm">
                  <span>{mat}</span>
                  <span className="text-xs text-[#A69B8B] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Architectural Colour Palette</p>
            <h2 className="font-serif text-3xl font-light">Tonal Surface Harmony</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {project.palette.map((swatch) => (
                <div key={swatch.name} className="bg-[#FFFFFF] border border-[#252521]/10 p-5 flex items-center gap-5">
                  <div
                    className="w-16 h-16 shrink-0 border border-[#252521]/15"
                    style={{ backgroundColor: swatch.hex }}
                    aria-label={swatch.name}
                  />
                  <div className="space-y-1 min-w-0">
                    <p className="font-serif text-xl truncate">{swatch.name}</p>
                    <p className="text-xs text-[#252521]/65">{swatch.finish}</p>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-[#A69B8B] tabular-nums">
                      {swatch.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Editorial Gallery */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24 border-b border-[#252521]/10 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Architectural Plates</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mt-1">Interior & Material Gallery</h2>
          </div>
          <span className="text-xs text-[#252521]/55 tabular-nums">{allPlates.length} Plates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allPlates.map((img, idx) => (
            <div
              key={`${img}-${idx}`}
              className={`group relative overflow-hidden ${idx === 0 ? 'md:col-span-2' : ''}`}
            >
              <ArchitecturalImage
                src={img}
                alt={`${project.title} plate ${idx + 1}`}
                aspectClassName={idx === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}
                onClick={() => setLightboxIndex(idx)}
              />
              <button
                type="button"
                onClick={() => setLightboxIndex(idx)}
                aria-label={`Expand plate ${idx + 1}`}
                className="absolute top-4 right-4 w-9 h-9 bg-[#F4F1EA]/90 text-[#252521] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Maximize2 className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Related Projects */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24 space-y-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Continue Exploring</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mt-1">Related Commissions</h2>
          </div>
          <Link
            to="/start-project"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.16em] uppercase"
          >
            <span>Commission a Similar Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {related.map((rel) => (
            <Link key={rel.id} to={`/projects/${rel.slug}`} className="group space-y-3 block">
              <ArchitecturalImage
                src={rel.heroImage}
                alt={rel.title}
                aspectClassName="aspect-[4/3]"
                className="group-hover:scale-[1.03]"
              />
              <div className="text-xs text-[#A69B8B] tabular-nums">
                {rel.location} · {rel.year}
              </div>
              <h3 className="font-serif text-2xl group-hover:text-[#A69B8B] transition-colors">{rel.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <LightboxModal
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </article>
  );
}
