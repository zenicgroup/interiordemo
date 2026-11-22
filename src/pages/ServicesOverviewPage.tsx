import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { useDocumentSeo, useStudio } from '../context/StudioContext';

const PILLARS = [
  {
    title: 'Residential Interiors',
    route: '/services/residential',
    summary: 'Private townhouses, penthouses, space planning, bespoke cabinetry, and fine textile styling.',
  },
  {
    title: 'Commercial Interiors',
    route: '/services/commercial',
    summary: 'Executive headquarters, boutique hospitality suites, galleries, and acoustic environments.',
  },
  {
    title: 'Architecture',
    route: '/services/architecture',
    summary: 'Ground-up coastal villas, structural extensions, masterplanning, and 3D daylight visualization.',
  },
  {
    title: 'Turnkey Solutions',
    route: '/services/turnkey',
    summary: 'Renovation management, global FF&E procurement, site supervision, and white-glove handover.',
  },
];

export function ServicesOverviewPage() {
  useDocumentSeo('/services', 'Studio Services | Sorel Spaces');
  const { services } = useStudio();

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Practice Disciplines</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-light text-balance">
              Integrated Architecture, Interior Design & Turnkey Delivery
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Explore our four core studio divisions and eight specialized capabilities engineered to take projects cleanly from feasibility study to final placement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.route}
              to={pillar.route}
              className="group bg-[#FFFFFF] border border-[#252521]/10 p-7 flex flex-col justify-between space-y-8 hover:border-[#252521] transition-colors"
            >
              <div className="space-y-3">
                <h2 className="font-serif text-2xl group-hover:text-[#A69B8B] transition-colors">{pillar.title}</h2>
                <p className="text-sm text-[#252521]/70 leading-relaxed">{pillar.summary}</p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase">
                <span>Explore Division</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>

        <div className="space-y-16 pt-6">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-16 border-b border-[#252521]/12"
            >
              <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <ArchitecturalImage src={service.image} alt={service.title} aspectClassName="aspect-[4/3]" />
              </div>
              <div className={`lg:col-span-7 space-y-5 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="flex items-center gap-3 text-xs text-[#A69B8B] tabular-nums">
                  <span>{service.number}</span>
                  <span aria-hidden="true">·</span>
                  <span>{service.subtitle}</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-light">{service.title}</h2>
                <p className="text-base text-[#252521]/80 leading-relaxed max-w-2xl">{service.description}</p>
                <ul className="space-y-2 text-sm text-[#252521]/75">
                  {service.details.map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
                <div className="pt-2 flex flex-wrap items-center gap-6">
                  <Link
                    to={`/start-project?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.16em] uppercase hover:bg-[#3A3A34]"
                  >
                    <span>Enquire About Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={service.pillarRoute}
                    className="text-xs tracking-[0.16em] uppercase border-b border-[#252521] pb-1"
                  >
                    Division Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
