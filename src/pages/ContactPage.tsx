import { ConsultationForm } from '../components/ConsultationForm';
import { useDocumentSeo, useStudio } from '../context/StudioContext';

const STUDIOS = [
  {
    city: 'New York — Headquarters',
    address: '48 Mercer Street, Suite 4B, New York, NY 10013',
    phone: '+1 (212) 555-0184',
    email: 'newyork@sorelspaces.com',
    hours: 'Monday – Friday · 9:00 AM – 6:30 PM EST',
  },
  {
    city: 'London — European Studio',
    address: '24 Walton Street, Chelsea, London SW3 1JA',
    phone: '+44 20 7946 0410',
    email: 'london@sorelspaces.com',
    hours: 'Monday – Friday · 9:00 AM – 6:00 PM GMT',
  },
  {
    city: 'Milan — Materiality & Procurement',
    address: 'Via Solferino 18, 20121 Milano MI, Italy',
    phone: '+39 02 8974 1120',
    email: 'milano@sorelspaces.com',
    hours: 'By Private Appointment',
  },
];

export function ContactPage() {
  useDocumentSeo('/contact', 'Contact | Sorel Spaces');
  const { siteContent } = useStudio();

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-12 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Studio Contact</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-light text-balance">
              New Commissions, Press & Private Appointments
            </h1>
          </div>
          <div className="lg:col-span-5 space-y-2 text-sm text-[#252521]/75">
            <p>General & Commission Desk: {siteContent.studioEmail}</p>
            <p>Press & Editorial Archive: press@sorelspaces.com</p>
            <p>Studio Careers: careers@sorelspaces.com</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STUDIOS.map((studio) => (
            <div key={studio.city} className="bg-[#FFFFFF] border border-[#252521]/10 p-8 space-y-4">
              <h2 className="font-serif text-2xl">{studio.city}</h2>
              <p className="text-sm text-[#252521]/75 leading-relaxed">{studio.address}</p>
              <div className="pt-4 border-t border-[#252521]/10 text-xs text-[#252521]/65 space-y-1.5">
                <p>{studio.phone}</p>
                <p>{studio.email}</p>
                <p>{studio.hours}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-[#FFFFFF] border border-[#252521]/10 p-8 md:p-14 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Send an Enquiry</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">{siteContent.consultationHeadline}</h2>
            <p className="text-sm text-[#252521]/75">{siteContent.consultationSubtext}</p>
          </div>
          <ConsultationForm />
        </section>
      </div>
    </div>
  );
}
