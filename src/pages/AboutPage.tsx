import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { useDocumentSeo, useStudio } from '../context/StudioContext';
import { STUDIO_IMAGES } from '../data/seedData';

const AWARDS = [
  { year: '2025', recognition: 'Architectural Digest AD100 Featured Practice', project: 'The Ivory Residence' },
  { year: '2024', recognition: 'Wallpaper* Design Awards — Best Private Villa', project: 'The Serene Villa' },
  { year: '2024', recognition: 'European Workplace Architecture Honor', project: 'The Contemporary Workspace' },
  { year: '2023', recognition: 'RIBA Conservation & Adaptive Reuse Shortlist', project: 'The Heritage Residence' },
];

export function AboutPage() {
  useDocumentSeo('/about', 'About Studio | Sorel Spaces');
  const { siteContent, team } = useStudio();

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-24">
        {/* Studio Manifesto Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-16 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">About Sorel Spaces</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.6rem)] leading-[1.02] font-light text-balance">
              Architecture Shaped Around Silence, Materiality & Human Ritual.
            </h1>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <p className="font-serif italic text-2xl text-[#252521]/85">{siteContent.tagline}</p>
            <p className="text-sm text-[#252521]/75 leading-relaxed">{siteContent.introBody}</p>
          </div>
        </section>

        {/* Full-Width Architectural Study */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-7">
            <ArchitecturalImage
              src={STUDIO_IMAGES.heroIvory}
              alt="Sorel Spaces New York residential commission"
              aspectClassName="aspect-[16/10] h-full"
            />
          </div>
          <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#252521]/10 p-8 md:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#A69B8B]">Founded 2008</p>
              <h2 className="font-serif text-3xl font-light">A Singular Practice Across Three Cities</h2>
              <p className="text-sm text-[#252521]/75 leading-relaxed">
                From our founding studio in SoHo, New York, to partner practices in Chelsea, London and Brera, Milan, our architects and interior specialists collaborate seamlessly across time zones.
              </p>
              <p className="text-sm text-[#252521]/75 leading-relaxed">
                We take on twelve private and commercial commissions per year so principal leadership remains directly involved from initial pencil sketch through bespoke furniture installation.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-[#252521]/15">
              <div>
                <p className="font-serif text-3xl tabular-nums">12</p>
                <p className="text-xs text-[#252521]/60">Commissions Per Year</p>
              </div>
              <div>
                <p className="font-serif text-3xl tabular-nums">34</p>
                <p className="text-xs text-[#252521]/60">Architects & Specialists</p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Guiding Principles */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14 border-y border-[#252521]/15">
          <div className="space-y-3">
            <p className="text-xs text-[#A69B8B] tabular-nums">01.</p>
            <h3 className="font-serif text-2xl">Proportion Before Ornament</h3>
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Room comfort begins with ceiling datum lines, balanced door heights, and unobstructed sightlines. Furniture arrives only after architectural geometry feels effortless.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-[#A69B8B] tabular-nums">02.</p>
            <h3 className="font-serif text-2xl">Material Longevity</h3>
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              We specify unsealed travertine, European white oak, Belgian flax, and breathable mineral limewash—materials that reward touch and age with dignity.
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-xs text-[#A69B8B] tabular-nums">03.</p>
            <h3 className="font-serif text-2xl">Single-Point Accountability</h3>
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Architecture, interior styling, lighting, and turnkey site administration operate under one studio roof—eliminating fragmentation between vision and execution.
            </p>
          </div>
        </section>

        {/* Honours & Recognition */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Recognition</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">Selected Honors & Publications</h2>
          </div>
          <div className="lg:col-span-8 divide-y divide-[#252521]/15 border-y border-[#252521]/15">
            {AWARDS.map((item) => (
              <div key={item.recognition} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-baseline gap-6">
                  <span className="text-xs text-[#A69B8B] tabular-nums">{item.year}</span>
                  <span className="font-serif text-xl">{item.recognition}</span>
                </div>
                <span className="text-xs text-[#252521]/60">{item.project}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Leadership Preview */}
        <section className="space-y-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Studio Partners</p>
              <h2 className="font-serif text-3xl md:text-4xl font-light mt-1">Principal Leadership</h2>
            </div>
            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase border-b border-[#252521] pb-1"
            >
              <span>All Team Profiles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.slice(0, 3).map((member) => (
              <div key={member.id} className="space-y-3">
                <ArchitecturalImage src={member.image} alt={member.name} aspectClassName="aspect-[3/4]" />
                <h3 className="font-serif text-2xl pt-1">{member.name}</h3>
                <p className="text-xs tracking-[0.14em] uppercase text-[#A69B8B]">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
