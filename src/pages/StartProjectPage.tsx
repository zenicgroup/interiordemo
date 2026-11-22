import { useSearchParams } from 'react-router-dom';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { ConsultationForm } from '../components/ConsultationForm';
import { useDocumentSeo, useStudio } from '../context/StudioContext';
import { STUDIO_IMAGES } from '../data/seedData';

export function StartProjectPage() {
  useDocumentSeo('/start-project', 'Start a Project | Sorel Spaces');
  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get('service') || '';
  const { siteContent } = useStudio();

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Commission Brief</p>
              <h1 className="font-serif text-[clamp(2.5rem,4.6vw,4.2rem)] leading-[1.03] font-light text-balance">
                {siteContent.consultationHeadline}
              </h1>
              <p className="text-sm text-[#252521]/75 leading-relaxed">
                {siteContent.consultationSubtext}
              </p>
            </div>

            <ArchitecturalImage
              src={STUDIO_IMAGES.materialsPalette}
              alt="Sorel Spaces material consultation board"
              aspectClassName="aspect-[4/3]"
            />

            <div className="space-y-4 pt-4 border-t border-[#252521]/15 text-sm text-[#252521]/75">
              <p className="text-[11px] tracking-[0.18em] uppercase text-[#A69B8B]">What Happens Next</p>
              <div className="space-y-2.5 text-xs leading-relaxed">
                <p>01. Senior Partner Review — Within 48 hours of submitting your architectural brief.</p>
                <p>02. Discovery Conversation — A 45-minute private video or in-studio consultation.</p>
                <p>03. Tailored Proposal — Scope schedule, phase fee structure, and target timeline.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#252521]/10 p-6 sm:p-10 md:p-12">
            <ConsultationForm defaultProjectType={defaultService} />
          </div>
        </div>
      </div>
    </div>
  );
}
