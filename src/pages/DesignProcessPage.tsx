import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { useDocumentSeo, useStudio } from '../context/StudioContext';
import { STUDIO_IMAGES } from '../data/seedData';

const DETAILED_PHASES = [
  {
    number: '01',
    phase: 'Discover',
    weeks: 'Weeks 1 – 3',
    summary: 'Understanding how you live, site constraints, architectural potential, and investment alignment.',
    clientMilestones: ['Initial Private Brief & Lifestyle Audit', '3D Laser Point-Cloud Survey', 'Zoning & Structural Feasibility Report'],
    deliverables: ['Site Dossier', 'Preliminary Program Matrix', 'Target Budget Framework'],
  },
  {
    number: '02',
    phase: 'Concept',
    weeks: 'Weeks 4 – 8',
    summary: 'Establishing spatial clarity, circulation flow, massing studies, and physical quarry stone & textile palettes.',
    clientMilestones: ['Architectural Floorplan Options', 'Physical Material Board Review', 'Preliminary Furniture Direction'],
    deliverables: ['Concept Monograph', 'Physical Material Box', 'Spatial Mood Elevations'],
  },
  {
    number: '03',
    phase: 'Develop',
    weeks: 'Weeks 9 – 18',
    summary: 'Precision engineering of millwork, lighting coves, MEP integration, tender documentation, and 4K 3D visualizations.',
    clientMilestones: ['Photorealistic 3D Light Studies', 'Millwork & Stone Shop Review', 'General Contractor Tender Selection'],
    deliverables: ['Full BIM Construction Set', 'Bespoke Joinery Schedule', 'Lighting & FF&E Specifications'],
  },
  {
    number: '04',
    phase: 'Deliver',
    weeks: 'Construction – Handover',
    summary: 'Continuous site observation, workshop quality inspections, global logistics, and final editorial styling.',
    clientMilestones: ['Weekly Site Walkthroughs', 'Custom Fabrication Sign-Off', 'White-Glove Installation & Handover'],
    deliverables: ['As-Built Archive', 'Care & Patina Manual', 'Completed Space'],
  },
];

export function DesignProcessPage() {
  useDocumentSeo('/process', 'Design Process | Sorel Spaces');
  const { siteContent } = useStudio();

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Studio Methodology</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-light text-balance">
              {siteContent.processHeadline}
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Every commission progresses through four transparent, milestone-driven stages engineered to safeguard architectural intent, craft precision, and schedule certainty.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {DETAILED_PHASES.map((item) => (
            <section
              key={item.number}
              className="bg-[#FFFFFF] border border-[#252521]/10 p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-4 space-y-2">
                <div className="flex items-center gap-3 text-xs text-[#A69B8B] tabular-nums">
                  <span>Phase {item.number}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.weeks}</span>
                </div>
                <h2 className="font-serif text-4xl font-light">{item.phase}</h2>
                <p className="text-sm text-[#252521]/75 leading-relaxed pt-2">{item.summary}</p>
              </div>

              <div className="lg:col-span-4 space-y-3">
                <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B]">Key Milestones</p>
                <ul className="space-y-2 text-sm text-[#252521]/80">
                  {item.clientMilestones.map((m) => (
                    <li key={m}>— {m}</li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-4 space-y-3">
                <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B]">Studio Deliverables</p>
                <ul className="space-y-2 text-sm text-[#252521]/80">
                  {item.deliverables.map((d) => (
                    <li key={d}>· {d}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <section className="space-y-8 pt-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Process in Practice</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">Measured Transformation Case Study</h2>
            <p className="text-sm text-[#252521]/75">
              Drag the divider below to inspect how architectural intervention reshapes daylight, proportion, and material permanence.
            </p>
          </div>
          <BeforeAfterSlider
            beforeImage={STUDIO_IMAGES.beforeRenovation}
            afterImage={STUDIO_IMAGES.afterRenovation}
          />
        </section>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-10 bg-[#252521] text-[#F4F1EA]">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-light">Ready to initiate Phase 01?</h2>
            <p className="text-sm text-[#F4F1EA]/70">
              Schedule a private feasibility conversation with our senior architectural partners.
            </p>
          </div>
          <Link
            to="/start-project"
            className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#F4F1EA] text-[#252521] text-xs tracking-[0.18em] uppercase shrink-0"
          >
            <span>Start a Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
