import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createSeedDatabase } from '../data/seedData';
import type {
  JournalArticle,
  MaterialDetail,
  Project,
  SeoEntry,
  ServiceItem,
  SiteContent,
  TeamMember,
  Testimonial,
} from '../types/studio';

interface PublicStudioData {
  projects: Project[];
  categories: string[];
  services: ServiceItem[];
  team: TeamMember[];
  journal: JournalArticle[];
  testimonials: Testimonial[];
  materials: MaterialDetail[];
  siteContent: SiteContent;
  seo: SeoEntry[];
}

interface StudioContextValue extends PublicStudioData {
  loading: boolean;
  refreshData: () => Promise<void>;
}

const seed = createSeedDatabase();

const initialData: PublicStudioData = {
  projects: seed.projects,
  categories: seed.categories,
  services: seed.services,
  team: seed.team,
  journal: seed.journal,
  testimonials: seed.testimonials,
  materials: seed.materials,
  siteContent: seed.siteContent,
  seo: seed.seo,
};

const StudioContext = createContext<StudioContextValue>({
  ...initialData,
  loading: false,
  refreshData: async () => {},
});

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PublicStudioData>(initialData);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const json = (await res.json()) as PublicStudioData;
        setData(json);
      }
    } catch {
      // Retain hydrated seed state if offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  return (
    <StudioContext.Provider value={{ ...data, loading, refreshData }}>
      {children}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  return useContext(StudioContext);
}

export function useDocumentSeo(routeKey: string, fallbackTitle?: string, fallbackDescription?: string) {
  const { seo } = useStudio();

  useEffect(() => {
    const matched = seo.find((s) => s.route === routeKey);
    const title = matched?.title || fallbackTitle || 'Sorel Spaces | Luxury Interior Design & Architecture Studio';
    const description =
      matched?.description ||
      fallbackDescription ||
      'Thoughtful architecture and interiors shaped around the way you live, work and experience space.';

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [seo, routeKey, fallbackTitle, fallbackDescription]);
}
