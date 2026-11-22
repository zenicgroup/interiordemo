import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { ConsultationForm } from '../components/ConsultationForm';
import { useDocumentSeo, useStudio } from '../context/StudioContext';
import { STUDIO_IMAGES } from '../data/seedData';

export type ServicePillarKind = 'residential' | 'commercial' | 'architecture' | 'turnkey';

const PILLAR_CONTENT: Record<
  ServicePillarKind,
  {
    route: string;
    eyebrow: string;
    title: string;
    lead: string;
    image: string;
    secondaryImage: string;
    focusTitle: string;
    focusBody: string;
    capabilities: { title: string; copy: string }[];
    projectFilter: string;
  }
> = {
  residential: {
    route: '/services/residential',
    eyebrow: 'Division 01 · Private Living',
    title: 'Residential Interior Design, Space Planning & Styling',
    lead: 'Calm, deeply personal sanctuaries engineered around natural daylight, tactile European materials, and custom architectural joinery.',
    image: STUDIO_IMAGES.heroIvory,
    secondaryImage: STUDIO_IMAGES.minimalistApartment,
    focusTitle: 'Tailored to Daily Ritual',
    focusBody:
      'Whether transforming an urban penthouse or restoring a multi-story limestone townhouse, our residential studio designs bespoke kitchens, serene bathing sanctuaries, custom furniture pieces, and layered textile palettes.',
    capabilities: [
      {
        title: 'Interior Architecture & Millwork',
        copy: 'Custom fluted oak islands, concealed pocket doors, library wall systems, and honed stone hearths.',
      },
      {
        title: 'Precision Space Planning',
        copy: 'Structural opening reconfiguration, furniture ergonomics, and effortless room-to-room circulation.',
      },
      {
        title: 'Collectible Furniture & Styling',
        copy: 'Direct sourcing from Milan, Paris, and Nordic workshops alongside bespoke drapery and fine art placement.',
      },
    ],
    projectFilter: 'Residential',
  },
  commercial: {
    route: '/services/commercial',
    eyebrow: 'Division 02 · Hospitality & Executive Workplaces',
    title: 'Commercial Interiors & Tactile Workspaces',
    lead: 'Private wealth offices, boutique hospitality environments, and flagship galleries crafted with residential warmth and acoustic stillness.',
    image: STUDIO_IMAGES.contemporaryWorkspace,
    secondaryImage: STUDIO_IMAGES.urbanPenthouse,
    focusTitle: 'Atmosphere That Earns Trust',
    focusBody:
      'Modern commercial spaces should cultivate clarity rather than sterile distraction. We integrate concealed AV engineering, acoustic walnut baffling, and museum-grade lighting into elevated client-facing headquarters.',
    capabilities: [
      {
        title: 'Executive Headquarters & Advisory Salons',
        copy: 'Boardrooms, private client suites, and acoustic focus rooms built in stone and timber.',
      },
      {
        title: 'Boutique Hospitality & Galleries',
        copy: 'Lobby arrival choreography, curated dining lounges, and custom lighting schemes.',
      },
      {
        title: 'Technical Code & Acoustic Integration',
        copy: 'Seamless integration of HVAC diffusers, acoustic dampening, and fire-rated natural finishes.',
      },
    ],
    projectFilter: 'Commercial',
  },
  architecture: {
    route: '/services/architecture',
    eyebrow: 'Division 03 · Ground-Up & Structural Design',
    title: 'Architectural Design & 3D Visualization',
    lead: 'Site-responsive villas, structural additions, and photorealistic light studies anchored in limestone, concrete, and timber.',
    image: STUDIO_IMAGES.sereneVilla,
    secondaryImage: STUDIO_IMAGES.journalLight,
    focusTitle: 'Building With Orientation & Permanence',
    focusBody:
      'Our licensed architectural team leads every project from topographic feasibility and zoning approvals through passive solar orientation, structural engineering coordination, and 4K 3D daylight simulation.',
    capabilities: [
      {
        title: 'Ground-Up Villas & Estates',
        copy: 'Holistic indoor-outdoor pavilions calibrated to climate, topography, and coastal light.',
      },
      {
        title: 'Structural Additions & Extensions',
        copy: 'Glass-and-steel courtyard pavilions, rooftop penthouses, and subterranean spa levels.',
      },
      {
        title: '3D Visualization & BIM',
        copy: 'Physically calibrated sun-path renderings verifying stone veining and luminance before build.',
      },
    ],
    projectFilter: 'Architecture',
  },
  turnkey: {
    route: '/services/turnkey',
    eyebrow: 'Division 04 · End-to-End Execution',
    title: 'Turnkey Interior Solutions & Renovation Management',
    lead: 'Single-point studio accountability spanning structural remodeling, contractor tendering, global procurement, and white-glove installation.',
    image: STUDIO_IMAGES.afterRenovation,
    secondaryImage: STUDIO_IMAGES.heritageResidence,
    focusTitle: 'Zero Friction From Permit to Keys',
    focusBody:
      'Complex renovations and heritage restorations demand unified execution. Our project management directors oversee every craftsman, customs shipment, budget milestone, and site inspection until your keys are handed over.',
    capabilities: [
      {
        title: 'Full Renovation & Remodeling',
        copy: 'Historic conservation, structural steel insertion, radiant subfloors, and breathable lime plaster.',
      },
      {
        title: 'Global Procurement & Logistics',
        copy: 'Direct quarry stone inspection, factory quality assurance, freight consolidation, and warehousing.',
      },
      {
        title: 'Site Supervision & Styling Handover',
        copy: 'Weekly site reporting, punch-list resolution, bespoke linen steaming, and final architectural dressing.',
      },
    ],
    projectFilter: 'Renovation',
  },
};

export function ServicePillarPage({ kind }: { kind: ServicePillarKind }) {
  const config = PILLAR_CONTENT[kind];
  useDocumentSeo(config.route, `${config.title} | Sorel Spaces`);
  const { projects } = useStudio();
  const matchedProjects = projects.filter((p) => p.category === config.projectFilter);
  const showcaseProjects = matchedProjects.length > 0 ? matchedProjects : projects.slice(0, 2);

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-20">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-12 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">{config.eyebrow}</p>
            <h1 className="font-serif text-[clamp(2.4rem,4.8vw,4.3rem)] leading-[1.03] font-light text-balance">
              {config.title}
            </h1>
          </div>
          <div className="lg:col-span-5 space-y-5">
            <p className="text-sm text-[#252521]/75 leading-relaxed">{config.lead}</p>
            <Link
              to={`/start-project?service=${encodeURIComponent(config.title)}`}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.16em] uppercase"
            >
              <span>Request Division Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8">
            <ArchitecturalImage src={config.image} alt={config.title} aspectClassName="aspect-[16/10] h-full" />
          </div>
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#FFFFFF] border border-[#252521]/10 p-8 space-y-6">
            <ArchitecturalImage src={config.secondaryImage} alt={config.focusTitle} aspectClassName="aspect-[4/3]" />
            <div className="space-y-3">
              <h2 className="font-serif text-3xl font-light">{config.focusTitle}</h2>
              <p className="text-sm text-[#252521]/75 leading-relaxed">{config.focusBody}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-[#252521]/15">
          {config.capabilities.map((cap, idx) => (
            <div key={cap.title} className="space-y-3">
              <span className="text-xs text-[#A69B8B] tabular-nums">{String(idx + 1).padStart(2, '0')}.</span>
              <h3 className="font-serif text-2xl">{cap.title}</h3>
              <p className="text-sm text-[#252521]/75 leading-relaxed">{cap.copy}</p>
            </div>
          ))}
        </section>

        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl font-light">Representative Works</h2>
            <Link to="/projects" className="text-xs tracking-[0.16em] uppercase border-b border-[#252521] pb-1">
              Full Archive
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {showcaseProjects.slice(0, 2).map((proj) => (
              <Link key={proj.id} to={`/projects/${proj.slug}`} className="group block space-y-3">
                <ArchitecturalImage
                  src={proj.heroImage}
                  alt={proj.title}
                  aspectClassName="aspect-[16/10]"
                  className="group-hover:scale-[1.03]"
                />
                <div className="text-xs text-[#A69B8B] tabular-nums">
                  {proj.location} · {proj.year}
                </div>
                <h3 className="font-serif text-2xl group-hover:text-[#A69B8B] transition-colors">{proj.title}</h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-[#FFFFFF] border border-[#252521]/10 p-8 md:p-14 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Enquire</p>
            <h2 className="font-serif text-3xl font-light">Discuss a {config.projectFilter} Commission</h2>
          </div>
          <ConsultationForm defaultProjectType={config.title} compact />
        </section>
      </div>
    </div>
  );
}
