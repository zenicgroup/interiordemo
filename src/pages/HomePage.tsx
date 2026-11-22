import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Maximize2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { ConsultationForm } from '../components/ConsultationForm';
import { EDITORIAL_EASE, EditorialReveal, HairlineRule } from '../components/EditorialMotion';
import { LightboxModal } from '../components/LightboxModal';
import { useDocumentSeo, useStudio } from '../context/StudioContext';
import { STUDIO_IMAGES } from '../data/seedData';

const PROCESS_STAGES = [
  {
    number: '01',
    title: 'Discover',
    subtitle: 'Understanding the client & site',
    duration: 'Weeks 1 – 3',
    summary:
      'In-depth lifestyle and operational interviews, measured laser surveys, structural feasibility, solar orientation mapping, and preliminary investment alignment.',
    deliverable: 'Architectural Brief & Site Dossier',
  },
  {
    number: '02',
    title: 'Concept',
    subtitle: 'Design direction & moodboards',
    duration: 'Weeks 4 – 8',
    summary:
      'Spatial zoning options, circulation clarity, physical quarry stone and textile moodboards, and cohesive architectural narrative.',
    deliverable: 'Concept Monograph & Material Box',
  },
  {
    number: '03',
    title: 'Develop',
    subtitle: 'Drawings, materials & 3D visualizations',
    duration: 'Weeks 9 – 18',
    summary:
      'Full technical BIM documentation, bespoke millwork joinery drawings, lighting choreography, and photorealistic 3D daylight plates.',
    deliverable: 'Construction Set & 3D Visualization Plates',
  },
  {
    number: '04',
    title: 'Deliver',
    subtitle: 'Execution & final styling',
    duration: 'Construction – Handover',
    summary:
      'Dedicated site supervision, artisan fabrication QA, global FF&E procurement logistics, art placement, and white-glove residential styling.',
    deliverable: 'Turnkey Commissioning & Final Styling',
  },
];

export function HomePage() {
  useDocumentSeo('/');
  const { projects, categories, services, team, testimonials, materials, journal, siteContent } = useStudio();

  const heroSlides =
    projects.filter((p) => p.heroSlide).length > 0 ? projects.filter((p) => p.heroSlide) : projects.slice(0, 4);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeProcessIndex, setActiveProcessIndex] = useState(0);
  const [activeMaterialIndex, setActiveMaterialIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  const currentHero = heroSlides[activeSlide] || heroSlides[0];
  const filteredProjects =
    selectedCategory === 'All'
      ? projects.slice(0, 6)
      : projects.filter((p) => p.category === selectedCategory);

  const lightboxItems = filteredProjects.map((p) => ({
    src: p.heroImage,
    caption: p.title,
    subtitle: `${p.location} · ${p.year}`,
  }));

  const activeService = services[activeServiceIndex] || services[0];
  const activeMaterial = materials[activeMaterialIndex] || materials[0];

  return (
    <div className="bg-[#F4F1EA] text-[#252521]">
      {/* B. HERO SECTION */}
      <section className="relative min-h-[92vh] lg:min-h-screen w-full overflow-hidden bg-[#252521] text-[#FFFFFF] flex flex-col justify-between pt-24 pb-10 md:pb-12">
        <AnimatePresence mode="sync">
          {currentHero && (
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.15, ease: EDITORIAL_EASE }}
              className="absolute inset-0"
            >
              <motion.img
                src={currentHero.heroImage}
                alt={currentHero.title}
                referrerPolicy="no-referrer"
                initial={{ scale: 1.055 }}
                animate={{ scale: 1 }}
                transition={{ duration: 7.5, ease: 'easeOut' }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#191916]/80 via-[#191916]/45 to-[#191916]/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#191916]/80 via-transparent to-[#191916]/35" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EDITORIAL_EASE }}
          className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pt-4 flex items-center justify-between text-[11px] tracking-[0.2em] uppercase text-[#F4F1EA]/75"
        >
          <span>New York · London · Milan</span>
          <span className="hidden sm:inline">Issue No. 04 / Architectural Monograph</span>
        </motion.div>

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 my-auto py-12">
          <div className="max-w-3xl space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.12, ease: EDITORIAL_EASE }}
              className="text-[11px] tracking-[0.22em] uppercase text-[#D9CCB8]"
            >
              Interior Design · Architecture · Turnkey Delivery
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: EDITORIAL_EASE }}
              className="font-serif text-[clamp(2.85rem,6vw,5.4rem)] leading-[0.98] font-light tracking-[-0.015em] text-balance text-[#FFFFFF]"
            >
              {siteContent.heroHeadline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: EDITORIAL_EASE }}
              className="text-base md:text-lg text-[#F4F1EA]/85 max-w-xl leading-relaxed font-light"
            >
              {siteContent.heroSubheadline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.42, ease: EDITORIAL_EASE }}
              className="pt-3 flex flex-wrap items-center gap-6"
            >
              <Link
                to="/projects"
                className="group inline-flex items-center gap-3 px-7 py-4 bg-[#F4F1EA] text-[#252521] text-xs tracking-[0.18em] uppercase font-medium hover:bg-[#D9CCB8] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Explore Our Projects</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/start-project"
                className="inline-flex items-center gap-2 py-2 text-xs tracking-[0.18em] uppercase text-[#FFFFFF] border-b border-[#FFFFFF]/55 hover:border-[#FFFFFF] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Start a Project</span>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-t border-[#FFFFFF]/15 pt-5">
          {currentHero && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EDITORIAL_EASE }}
              >
                <Link to={`/projects/${currentHero.slug}`} className="group block space-y-1">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-[#D9CCB8] tabular-nums">
                    Featured · {String(activeSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                  </p>
                  <p className="font-serif text-xl md:text-2xl italic text-[#FFFFFF] group-hover:text-[#D9CCB8] transition-colors">
                    {currentHero.title}{' '}
                    <span className="not-italic text-sm font-sans tracking-wider text-[#F4F1EA]/70 ml-2 tabular-nums">
                      {currentHero.year}
                    </span>
                  </p>
                </Link>
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex items-center gap-2.5" role="tablist" aria-label="Hero showcase slides">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={idx === activeSlide}
                aria-label={`View ${slide.title}`}
                onClick={() => setActiveSlide(idx)}
                className="relative py-2 px-0.5 cursor-pointer"
              >
                <span
                  className={`block h-[3px] transition-all duration-500 ${
                    idx === activeSlide ? 'w-11 bg-[#FFFFFF]' : 'w-6 bg-[#FFFFFF]/35 hover:bg-[#FFFFFF]/65'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* C. STUDIO INTRODUCTION */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
          <EditorialReveal className="lg:col-span-6 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Studio Philosophy</p>
              <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.06] font-light text-balance">
                {siteContent.introHeadline}
              </h2>
              <p className="text-base text-[#252521]/80 leading-relaxed max-w-xl">{siteContent.introBody}</p>
              <p className="text-sm text-[#252521]/65 leading-relaxed max-w-xl">{siteContent.introSecondary}</p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 text-xs tracking-[0.18em] uppercase border-b border-[#252521] pb-1.5 hover:text-[#A69B8B] hover:border-[#A69B8B] transition-colors"
                >
                  <span>Explore Our Practice</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#252521]/15">
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light tabular-nums">140+</p>
                <p className="text-xs text-[#252521]/65 mt-1">Completed Commissions</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light tabular-nums">18</p>
                <p className="text-xs text-[#252521]/65 mt-1">Years of Practice</p>
              </div>
              <div>
                <p className="font-serif text-3xl md:text-4xl font-light tabular-nums">12</p>
                <p className="text-xs text-[#252521]/65 mt-1">Design Honours</p>
              </div>
            </div>
          </EditorialReveal>

          <EditorialReveal delay={0.14} className="lg:col-span-6 flex flex-col">
            <ArchitecturalImage
              src={STUDIO_IMAGES.journalLight}
              alt="Sculptural limewash plaster staircase illuminated by morning daylight"
              aspectClassName="aspect-[4/3] lg:aspect-auto lg:flex-1 min-h-[380px]"
            />
            <div className="flex items-center justify-between pt-3 text-xs text-[#252521]/60">
              <span>Sorel Monograph · Spatial Proportion & Natural Light</span>
              <span>New York · London · Milan</span>
            </div>
          </EditorialReveal>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <HairlineRule />
      </div>

      {/* D. FEATURED PROJECTS */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <EditorialReveal className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-[#252521]/15">
          <div className="space-y-3 max-w-xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Selected Portfolio</p>
            <h2 className="font-serif text-[clamp(2.25rem,3.8vw,3.3rem)] leading-[1.08] font-light text-balance">
              Architectural Works & Private Commissions
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-5" role="tablist" aria-label="Filter projects by category">
            {['All', ...categories].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative text-xs tracking-[0.16em] uppercase pb-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'text-[#252521] font-medium' : 'text-[#252521]/55 hover:text-[#252521]'
                  }`}
                >
                  <span>{cat}</span>
                  {active && (
                    <motion.span
                      layoutId="homeProjectFilterUnderline"
                      transition={{ duration: 0.32, ease: EDITORIAL_EASE }}
                      className="absolute inset-x-0 bottom-0 h-px bg-[#252521]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </EditorialReveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-14 pt-12">
          {filteredProjects.map((project, idx) => {
            const isWide = idx % 3 === 0;
            return (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.7, delay: (idx % 2) * 0.1, ease: EDITORIAL_EASE }}
                className={`group flex flex-col ${isWide ? 'md:col-span-7' : 'md:col-span-5'}`}
              >
                <div className="relative overflow-hidden mb-5">
                  <Link to={`/projects/${project.slug}`} className="block">
                    <ArchitecturalImage
                      src={project.heroImage}
                      alt={project.title}
                      aspectClassName={isWide ? 'aspect-[16/10]' : 'aspect-[4/3]'}
                      className="group-hover:scale-[1.035]"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Inspect ${project.title} in lightbox`}
                    className="absolute top-4 right-4 w-9 h-9 bg-[#F4F1EA]/90 text-[#252521] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#252521] hover:text-[#F4F1EA] cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#252521]/60 mb-2 tabular-nums">
                  <span>{project.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.year}</span>
                </div>

                <div className="flex items-baseline justify-between gap-4">
                  <Link to={`/projects/${project.slug}`}>
                    <h3 className="font-serif text-2xl md:text-3xl font-normal group-hover:text-[#A69B8B] transition-colors">
                      {project.title}
                    </h3>
                  </Link>
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-[#252521] hover:text-[#A69B8B] whitespace-nowrap shrink-0"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>

                <p className="text-sm text-[#252521]/70 leading-relaxed mt-2 max-w-xl">
                  {project.shortDescription}
                </p>
              </motion.article>
            );
          })}
        </div>

        <EditorialReveal className="pt-14 flex justify-end">
          <Link
            to="/projects"
            className="group inline-flex items-center gap-3 px-7 py-3.5 border border-[#252521] text-xs tracking-[0.18em] uppercase hover:bg-[#252521] hover:text-[#F4F1EA] transition-colors"
          >
            <span>View Full Project Archive</span>
            <ArrowRight className="w-4 h-4 stroke-[1.5] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </EditorialReveal>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <HairlineRule />
      </div>

      {/* E. SERVICES — ALL 8 DISCIPLINES */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <EditorialReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="space-y-3 max-w-xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Disciplines & Capabilities</p>
            <h2 className="font-serif text-[clamp(2.25rem,3.8vw,3.3rem)] leading-[1.08] font-light text-balance">
              Eight Integrated Studio Services
            </h2>
          </div>
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase border-b border-[#252521] pb-1 whitespace-nowrap shrink-0"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </EditorialReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6 divide-y divide-[#252521]/15 border-y border-[#252521]/15">
            {services.map((service, index) => {
              const isActive = index === activeServiceIndex;
              return (
                <div key={service.id} className="py-4">
                  <button
                    type="button"
                    onClick={() => setActiveServiceIndex(index)}
                    className="w-full text-left flex items-center justify-between gap-4 py-1.5 group cursor-pointer"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-xs text-[#A69B8B] tabular-nums font-medium">{service.number}.</span>
                      <span
                        className={`font-serif text-xl md:text-2xl transition-all duration-300 ${
                          isActive
                            ? 'text-[#252521] italic translate-x-1'
                            : 'text-[#252521]/75 group-hover:text-[#252521] group-hover:translate-x-1'
                        }`}
                      >
                        {service.title}
                      </span>
                    </div>
                    <span className="text-[11px] tracking-[0.15em] uppercase text-[#252521]/50 hidden sm:inline">
                      {isActive ? 'Selected' : 'Inspect'}
                    </span>
                  </button>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                      className="pt-3 pl-8 pr-2 space-y-4 lg:hidden"
                    >
                      <ArchitecturalImage
                        src={service.image}
                        alt={service.title}
                        aspectClassName="aspect-[16/10]"
                      />
                      <p className="text-sm text-[#252521]/80 leading-relaxed">{service.description}</p>
                      <ul className="space-y-1.5 text-xs text-[#252521]/70">
                        {service.details.map((d) => (
                          <li key={d}>— {d}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap items-center gap-5 pt-2">
                        <Link
                          to={`/start-project?service=${encodeURIComponent(service.title)}`}
                          className="px-5 py-2.5 bg-[#252521] text-[#F4F1EA] text-[11px] tracking-[0.16em] uppercase"
                        >
                          Enquire Now
                        </Link>
                        <Link
                          to={service.pillarRoute}
                          className="text-[11px] tracking-[0.16em] uppercase border-b border-[#252521] pb-1"
                        >
                          Read Discipline
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {activeService && (
            <div className="hidden lg:block lg:col-span-6 sticky top-28 bg-[#FFFFFF] border border-[#252521]/10 p-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.42, ease: EDITORIAL_EASE }}
                  className="space-y-6"
                >
                  <ArchitecturalImage
                    src={activeService.image}
                    alt={activeService.title}
                    aspectClassName="aspect-[16/10]"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-[#A69B8B] tabular-nums">
                      <span>{activeService.number}</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeService.subtitle}</span>
                    </div>
                    <h3 className="font-serif text-3xl text-[#252521]">{activeService.title}</h3>
                    <p className="text-sm text-[#252521]/80 leading-relaxed">{activeService.description}</p>
                  </div>

                  <div className="pt-4 border-t border-[#252521]/10 space-y-2">
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B]">Scope & Deliverables</p>
                    <ul className="space-y-1.5 text-sm text-[#252521]/80">
                      {activeService.details.map((detail) => (
                        <li key={detail}>— {detail}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-[#252521]/55 pt-2">{activeService.deliverables}</p>
                  </div>

                  <div className="pt-2 flex items-center gap-6">
                    <Link
                      to={`/start-project?service=${encodeURIComponent(activeService.title)}`}
                      className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.16em] uppercase hover:bg-[#3A3A34] transition-colors"
                    >
                      <span>Enquire About Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={activeService.pillarRoute}
                      className="text-xs tracking-[0.16em] uppercase border-b border-[#252521] pb-1 hover:text-[#A69B8B] hover:border-[#A69B8B]"
                    >
                      View Practice Page
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* F. DESIGN PROCESS */}
      <section className="bg-[#252521] text-[#F4F1EA] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-14">
          <EditorialReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#F4F1EA]/15">
            <div className="space-y-3 max-w-2xl">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#D9CCB8]">Methodology</p>
              <h2 className="font-serif text-[clamp(2.25rem,3.8vw,3.4rem)] leading-[1.06] font-light text-balance">
                {siteContent.processHeadline}
              </h2>
            </div>
            <Link
              to="/process"
              className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#D9CCB8] border-b border-[#D9CCB8]/50 pb-1 hover:text-[#FFFFFF] hover:border-[#FFFFFF] whitespace-nowrap shrink-0"
            >
              <span>Full Design Process</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </EditorialReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STAGES.map((stage, idx) => {
              const selected = idx === activeProcessIndex;
              return (
                <motion.button
                  key={stage.number}
                  type="button"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.65, delay: idx * 0.08, ease: EDITORIAL_EASE }}
                  onClick={() => setActiveProcessIndex(idx)}
                  className={`relative text-left p-6 border transition-colors flex flex-col justify-between space-y-6 cursor-pointer ${
                    selected
                      ? 'border-[#D9CCB8] bg-[#F4F1EA]/5'
                      : 'border-[#F4F1EA]/15 hover:border-[#F4F1EA]/40'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="processActiveTopRule"
                      transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                      className="absolute top-0 inset-x-0 h-[2px] bg-[#D9CCB8]"
                    />
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#D9CCB8] tabular-nums">
                      <span>{stage.number}</span>
                      <span>{stage.duration}</span>
                    </div>
                    <h3 className="font-serif text-3xl text-[#FFFFFF]">{stage.title}</h3>
                    <p className="text-xs tracking-[0.12em] uppercase text-[#A69B8B]">{stage.subtitle}</p>
                    <p className="text-sm text-[#F4F1EA]/75 leading-relaxed pt-2">{stage.summary}</p>
                  </div>
                  <p className="text-xs text-[#D9CCB8] pt-4 border-t border-[#F4F1EA]/15">
                    {stage.deliverable}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* G. MATERIALS & DETAILS */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <EditorialReveal className="lg:col-span-5 space-y-6">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Material Library</p>
            <h2 className="font-serif text-[clamp(2.25rem,3.6vw,3.2rem)] leading-[1.08] font-light text-balance">
              Natural Stone, Timber, Linen & Living Metals.
            </h2>
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Every interior begins at our physical specimen table—evaluating quarry stone porosity, raw flax weave density, and warm mineral limewash under shifting daylight.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {materials.map((mat, idx) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setActiveMaterialIndex(idx)}
                  className={`px-4 py-2 text-xs tracking-[0.14em] uppercase border transition-colors cursor-pointer ${
                    idx === activeMaterialIndex
                      ? 'bg-[#252521] text-[#F4F1EA] border-[#252521]'
                      : 'border-[#252521]/20 text-[#252521]/75 hover:border-[#252521]'
                  }`}
                >
                  {mat.title}
                </button>
              ))}
            </div>

            {activeMaterial && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMaterial.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: EDITORIAL_EASE }}
                  className="pt-6 border-t border-[#252521]/15 space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs text-[#A69B8B]">
                    <span>{activeMaterial.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeMaterial.origin}</span>
                  </div>
                  <h3 className="font-serif text-2xl">{activeMaterial.title}</h3>
                  <p className="text-sm text-[#252521]/80 leading-relaxed">{activeMaterial.description}</p>
                  <p className="text-xs text-[#252521]/60 pt-1">Application: {activeMaterial.application}</p>
                </motion.div>
              </AnimatePresence>
            )}
          </EditorialReveal>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
            <div className="sm:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMaterial?.id || 'default'}
                  initial={{ opacity: 0.3, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.3 }}
                  transition={{ duration: 0.48, ease: EDITORIAL_EASE }}
                  className="h-full"
                >
                  <ArchitecturalImage
                    src={activeMaterial?.image || STUDIO_IMAGES.materialsPalette}
                    alt={activeMaterial?.title || 'Architectural material board'}
                    aspectClassName="aspect-[4/3] h-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="sm:col-span-5 flex flex-col gap-6">
              <ArchitecturalImage
                src={STUDIO_IMAGES.materialsPalette}
                alt="Natural stone, smoked oak, bouclé and satin brass samples"
                aspectClassName="aspect-[4/3]"
              />
              <ArchitecturalImage
                src={STUDIO_IMAGES.luxuryBathroom}
                alt="Monolithic honed travertine bath architecture"
                aspectClassName="aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <HairlineRule />
      </div>

      {/* H. STUDIO EXPERTISE (TEAM) */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <EditorialReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="space-y-3 max-w-xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Leadership & Specialists</p>
            <h2 className="font-serif text-[clamp(2.25rem,3.6vw,3.2rem)] leading-[1.08] font-light text-balance">
              Architects, Interior Designers & Technical Directors
            </h2>
          </div>
          <Link
            to="/team"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase border-b border-[#252521] pb-1 whitespace-nowrap shrink-0"
          >
            <span>Meet Full Team</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </EditorialReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.slice(0, 3).map((member, idx) => (
            <EditorialReveal key={member.id} delay={idx * 0.1}>
              <article className="group space-y-4">
                <ArchitecturalImage
                  src={member.image}
                  alt={member.name}
                  aspectClassName="aspect-[3/4]"
                  className="group-hover:scale-[1.025]"
                />
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2 text-xs text-[#A69B8B]">
                    <span>{member.discipline}</span>
                    <span aria-hidden="true">·</span>
                    <span>{member.location}</span>
                  </div>
                  <h3 className="font-serif text-2xl">{member.name}</h3>
                  <p className="text-xs tracking-[0.12em] uppercase text-[#252521]/65">{member.role}</p>
                  <p className="text-sm text-[#252521]/75 leading-relaxed pt-1">{member.bio}</p>
                </div>
              </article>
            </EditorialReveal>
          ))}
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <HairlineRule />
      </div>

      {/* I. BEFORE & AFTER TRANSFORMATION */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28 border-b border-[#252521]/10">
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-10">
          <div className="lg:col-span-6 space-y-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Spatial Transformation</p>
            <h2 className="font-serif text-[clamp(2.25rem,3.6vw,3.2rem)] leading-[1.08] font-light text-balance">
              Before & After Architectural Renewal
            </h2>
          </div>
          <div className="lg:col-span-6 space-y-3 text-sm text-[#252521]/75 leading-relaxed">
            <p>
              A dated 1994 suburban reception room stripped back to its structural envelope and rebuilt with hand-troweled mineral limewash, arched European oak millwork, carved limestone fireplace surround, and herringbone white oak flooring.
            </p>
            <p className="text-xs text-[#252521]/55">
              Scope: Structural Opening · Custom Oak Joinery · Limestone Masonry · 11 Months
            </p>
          </div>
        </EditorialReveal>

        <EditorialReveal delay={0.1}>
          <BeforeAfterSlider
            beforeImage={STUDIO_IMAGES.beforeRenovation}
            afterImage={STUDIO_IMAGES.afterRenovation}
          />
        </EditorialReveal>
      </section>

      {/* J. CLIENT TESTIMONIALS */}
      <section className="bg-[#FFFFFF] border-b border-[#252521]/10 py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
          <EditorialReveal className="space-y-3 max-w-xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Client Perspectives</p>
            <h2 className="font-serif text-[clamp(2.25rem,3.6vw,3.2rem)] leading-[1.08] font-light">
              Words From Those Who Inhabit Our Work
            </h2>
          </EditorialReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#252521]/12 border border-[#252521]/12">
            {testimonials.map((item, idx) => (
              <motion.blockquote
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.65, delay: (idx % 2) * 0.08, ease: EDITORIAL_EASE }}
                className="bg-[#FFFFFF] p-8 md:p-12 flex flex-col justify-between space-y-8"
              >
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#252521] italic">
                  “{item.quote}”
                </p>
                <footer className="pt-4 border-t border-[#252521]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-[#252521]">{item.clientName}</p>
                    <p className="text-xs text-[#252521]/60">{item.role}</p>
                  </div>
                  <div className="text-xs text-[#A69B8B] sm:text-right">
                    <p>{item.projectTitle}</p>
                    <p>{item.location}</p>
                  </div>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* K. JOURNAL */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28 border-b border-[#252521]/10">
        <EditorialReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div className="space-y-3 max-w-xl">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Sorel Journal</p>
            <h2 className="font-serif text-[clamp(2.25rem,3.6vw,3.2rem)] leading-[1.08] font-light">
              Essays on Materiality, Light & Proportion
            </h2>
          </div>
          <Link
            to="/journal"
            className="group inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase border-b border-[#252521] pb-1 whitespace-nowrap shrink-0"
          >
            <span>Read All Essays</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </EditorialReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {journal.slice(0, 3).map((article, idx) => (
            <EditorialReveal key={article.id} delay={idx * 0.1}>
              <article className="group flex flex-col h-full">
                <Link to={`/journal/${article.slug}`} className="block mb-5">
                  <ArchitecturalImage
                    src={article.image}
                    alt={article.title}
                    aspectClassName="aspect-[4/3]"
                    className="group-hover:scale-[1.035]"
                  />
                </Link>
                <div className="flex items-center gap-2 text-xs text-[#A69B8B] mb-2">
                  <span>{article.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readTime}</span>
                </div>
                <Link to={`/journal/${article.slug}`}>
                  <h3 className="font-serif text-2xl leading-snug group-hover:text-[#A69B8B] transition-colors">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-sm text-[#252521]/70 leading-relaxed mt-2 flex-1">{article.excerpt}</p>
                <Link
                  to={`/journal/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase mt-4 pt-2 text-[#252521] hover:text-[#A69B8B]"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </article>
            </EditorialReveal>
          ))}
        </div>
      </section>

      {/* L. CONSULTATION CTA */}
      <section className="bg-[#D9CCB8]/35 py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <EditorialReveal className="lg:col-span-4 space-y-6">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#252521]/65">Private Commissions</p>
              <h2 className="font-serif text-[clamp(2.25rem,3.6vw,3.3rem)] leading-[1.05] font-light text-balance">
                {siteContent.consultationHeadline}
              </h2>
              <p className="text-sm text-[#252521]/75 leading-relaxed">{siteContent.consultationSubtext}</p>
              <div className="pt-4 border-t border-[#252521]/15 space-y-2 text-xs text-[#252521]/70">
                <p>Direct Studio Desk: {siteContent.studioEmail}</p>
                <p>Telephone: {siteContent.studioPhone}</p>
                <p>{siteContent.headquarters}</p>
              </div>
            </EditorialReveal>

            <EditorialReveal delay={0.12} className="lg:col-span-8 bg-[#FFFFFF] border border-[#252521]/10 p-6 sm:p-10 md:p-12">
              <ConsultationForm />
            </EditorialReveal>
          </div>
        </div>
      </section>

      <LightboxModal
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
