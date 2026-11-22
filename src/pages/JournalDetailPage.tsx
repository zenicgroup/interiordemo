import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ArchitecturalImage } from '../components/ArchitecturalImage';
import { useDocumentSeo, useStudio } from '../context/StudioContext';

export function JournalDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { journal } = useStudio();

  const article = journal.find((j) => j.slug === slug) || journal[0];
  useDocumentSeo(`/journal/${article?.slug || ''}`, article ? `${article.title} | Sorel Journal` : 'Sorel Journal');

  if (!article) {
    return (
      <div className="pt-36 pb-24 max-w-[1440px] mx-auto px-6 text-center">
        <h1 className="font-serif text-4xl">Essay Not Found</h1>
        <Link to="/journal" className="text-xs uppercase tracking-widest border-b border-[#252521]">
          Back to Journal
        </Link>
      </div>
    );
  }

  const related = journal.filter((j) => j.id !== article.id).slice(0, 2);

  return (
    <article className="pt-28 md:pt-36 pb-24 bg-[#F4F1EA] text-[#252521]">
      <div className="max-w-[1040px] mx-auto px-5 sm:px-8 space-y-10">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-xs tracking-[0.18em] uppercase text-[#252521]/65 hover:text-[#252521]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal</span>
        </Link>

        <header className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A69B8B]">
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}</span>
          </div>
          <h1 className="font-serif text-[clamp(2.3rem,4.5vw,3.9rem)] leading-[1.06] font-light text-balance">
            {article.title}
          </h1>
          <p className="text-sm text-[#252521]/65">By {article.author}</p>
        </header>

        <ArchitecturalImage
          src={article.image}
          alt={article.title}
          aspectClassName="aspect-[16/10]"
        />

        <div className="max-w-2xl mx-auto space-y-7 pt-4">
          <p className="font-serif text-2xl leading-relaxed text-[#252521]/90">{article.excerpt}</p>

          <blockquote className="py-6 my-8 border-y border-[#252521]/20">
            <p className="font-serif italic text-2xl md:text-3xl leading-snug text-[#252521]">
              “{article.pullQuote}”
            </p>
          </blockquote>

          {article.body.map((paragraph, idx) => (
            <p key={idx} className="text-base text-[#252521]/80 leading-[1.8]">
              {paragraph}
            </p>
          ))}
        </div>

        <section className="pt-16 mt-16 border-t border-[#252521]/15 space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl font-light">Further Reading</h2>
            <Link to="/journal" className="text-xs tracking-[0.16em] uppercase border-b border-[#252521] pb-1">
              All Articles
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {related.map((item) => (
              <Link key={item.id} to={`/journal/${item.slug}`} className="group space-y-3 block">
                <ArchitecturalImage
                  src={item.image}
                  alt={item.title}
                  aspectClassName="aspect-[4/3]"
                  className="group-hover:scale-[1.03]"
                />
                <p className="text-xs text-[#A69B8B]">
                  {item.category} · {item.readTime}
                </p>
                <h3 className="font-serif text-2xl group-hover:text-[#A69B8B] transition-colors">{item.title}</h3>
                <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.15em]">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
