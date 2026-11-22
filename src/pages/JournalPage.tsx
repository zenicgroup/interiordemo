import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { EDITORIAL_EASE, EditorialReveal } from '../components/EditorialMotion';
import { useDocumentSeo, useStudio } from '../context/StudioContext';

const JOURNAL_CATEGORIES = [
  'All',
  'Lighting Design',
  'Material Guides',
  'Space Planning',
  'Interior Inspiration',
  'Architecture Trends',
  'Design Insights',
];

export function JournalPage() {
  useDocumentSeo('/journal', 'Journal & Essays | Sorel Spaces');
  const { journal } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered =
    selectedCategory === 'All' ? journal : journal.filter((article) => article.category === selectedCategory);

  const leadArticle = filtered[0];
  const restArticles = filtered.slice(1);

  return (
    <div className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-14">
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end pb-10 border-b border-[#252521]/15">
          <div className="lg:col-span-7 space-y-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Sorel Journal</p>
            <h1 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-light text-balance">
              Notes on Architecture, Materiality & Luminous Space
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-sm text-[#252521]/75 leading-relaxed">
              Reflections from our studio desks on quarry stone specification, daylight calibration, heritage conservation, and contemporary residential proportion.
            </p>
          </div>
        </EditorialReveal>

        <div className="flex flex-wrap items-center gap-5" role="tablist" aria-label="Filter journal essays">
          {JOURNAL_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(cat)}
                className={`relative text-xs tracking-[0.15em] uppercase pb-2 transition-colors cursor-pointer ${
                  active ? 'text-[#252521] font-medium' : 'text-[#252521]/55 hover:text-[#252521]'
                }`}
              >
                <span>{cat}</span>
                {active && (
                  <motion.span
                    layoutId="journalFilterUnderline"
                    transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                    className="absolute inset-x-0 bottom-0 h-px bg-[#252521]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {leadArticle && (
          <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-14 border-b border-[#252521]/15">
            <Link to={`/journal/${leadArticle.slug}`} className="lg:col-span-7 block group">
              <ArchitecturalImage
                src={leadArticle.image}
                alt={leadArticle.title}
                aspectClassName="aspect-[16/10]"
                className="group-hover:scale-[1.025]"
              />
            </Link>
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#A69B8B]">
                <span>{leadArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.publishedAt}</span>
                <span aria-hidden="true">·</span>
                <span>{leadArticle.readTime}</span>
              </div>
              <Link to={`/journal/${leadArticle.slug}`}>
                <h2 className="font-serif text-3xl md:text-4xl font-light leading-tight hover:text-[#A69B8B] transition-colors">
                  {leadArticle.title}
                </h2>
              </Link>
              <p className="text-sm text-[#252521]/75 leading-relaxed">{leadArticle.excerpt}</p>
              <p className="text-xs text-[#252521]/55">By {leadArticle.author}</p>
              <div className="pt-2">
                <Link
                  to={`/journal/${leadArticle.slug}`}
                  className="inline-flex items-center gap-2 text-xs tracking-[0.16em] uppercase border-b border-[#252521] pb-1"
                >
                  <span>Read Essay</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </EditorialReveal>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {restArticles.map((article, idx) => (
            <motion.article
              key={article.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: (idx % 3) * 0.08, ease: EDITORIAL_EASE }}
              className="group flex flex-col"
            >
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
              <p className="text-xs text-[#252521]/55 mt-3">{article.author}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
