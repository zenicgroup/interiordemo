export type ProjectCategorySlug = 'Residential' | 'Commercial' | 'Architecture' | 'Renovation';

export interface PaletteSwatch {
  name: string;
  hex: string;
  finish: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  year: string;
  area: string;
  duration: string;
  shortDescription: string;
  overview: string;
  challenges: string;
  approach: string;
  materials: string[];
  palette: PaletteSwatch[];
  heroImage: string;
  gallery: string[];
  featured: boolean;
  published: boolean;
  heroSlide: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  pillarRoute: '/services/residential' | '/services/commercial' | '/services/architecture' | '/services/turnkey';
  number: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  deliverables: string;
  image: string;
  featured: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  discipline: 'Design' | 'Architecture' | 'Project Management' | 'Technical';
  location: string;
  credentials: string;
  bio: string;
  image: string;
  featured: boolean;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category:
    | 'Interior Inspiration'
    | 'Architecture Trends'
    | 'Material Guides'
    | 'Space Planning'
    | 'Lighting Design'
    | 'Design Insights';
  publishedAt: string;
  readTime: string;
  author: string;
  excerpt: string;
  body: string[];
  pullQuote: string;
  image: string;
  published: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  projectTitle: string;
  projectType: string;
  location: string;
  quote: string;
}

export interface MaterialDetail {
  id: string;
  title: string;
  category: string;
  origin: string;
  description: string;
  application: string;
  image: string;
}

export interface UploadedReferenceFile {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export type EnquiryStatus = 'New' | 'In Review' | 'Consultation Scheduled' | 'Archived';

export interface Enquiry {
  id: string;
  createdAt: string;
  status: EnquiryStatus;
  fullName: string;
  email: string;
  phone: string;
  projectType: string;
  propertyType: string;
  approximateArea: string;
  location: string;
  estimatedBudget: string;
  projectTimeline: string;
  description: string;
  referenceFiles: UploadedReferenceFile[];
}

export interface MediaAsset {
  id: string;
  title: string;
  category: string;
  url: string;
  aspectRatio: string;
  addedAt: string;
}

export interface SiteContent {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  introHeadline: string;
  introBody: string;
  introSecondary: string;
  processHeadline: string;
  consultationHeadline: string;
  consultationSubtext: string;
  studioEmail: string;
  studioPhone: string;
  headquarters: string;
}

export interface SeoEntry {
  route: string;
  pageName: string;
  title: string;
  description: string;
  keywords: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface StudioDatabase {
  projects: Project[];
  categories: string[];
  services: ServiceItem[];
  team: TeamMember[];
  journal: JournalArticle[];
  testimonials: Testimonial[];
  materials: MaterialDetail[];
  enquiries: Enquiry[];
  media: MediaAsset[];
  siteContent: SiteContent;
  seo: SeoEntry[];
  subscribers: NewsletterSubscriber[];
}
