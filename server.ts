import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { createSeedDatabase } from './src/data/seedData.ts';
import type { Enquiry, JournalArticle, MediaAsset, Project, StudioDatabase, TeamMember } from './src/types/studio.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'studio-db.json');
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'SOREL2026';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update(`sorel-spaces-${ADMIN_PASSCODE}`).digest('hex');

function ensureDbFile(): StudioDatabase {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seed = createSeedDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as StudioDatabase;
  } catch {
    const seed = createSeedDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
    return seed;
  }
}

function readDb(): StudioDatabase {
  return ensureDbFile();
}

function writeDb(db: StudioDatabase): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

function signToken(email: string): string {
  const payload = JSON.stringify({
    email,
    role: 'studio-admin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
  });
  const encoded = Buffer.from(payload).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifyToken(token: string | undefined): { email: string; role: string } | null {
  if (!token || !token.includes('.')) return null;
  const [encoded, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as {
      email: string;
      role: string;
      exp: number;
    };
    if (parsed.exp < Date.now()) return null;
    return { email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  const session = verifyToken(token);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized. Please sign in with studio credentials.' });
    return;
  }
  next();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function startServer() {
  ensureDbFile();

  const app = express();
  app.use(express.json({ limit: '20mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', studio: 'Sorel Spaces' });
  });

  app.get('/api/bootstrap', (_req, res) => {
    const db = readDb();
    res.json({
      projects: db.projects.filter((p) => p.published),
      categories: db.categories,
      services: db.services,
      team: db.team,
      journal: db.journal.filter((a) => a.published),
      testimonials: db.testimonials,
      materials: db.materials,
      siteContent: db.siteContent,
      seo: db.seo,
    });
  });

  app.post('/api/enquiries', (req, res) => {
    const body = req.body as Partial<Enquiry>;
    if (!body.fullName?.trim() || !body.email?.trim() || !body.description?.trim()) {
      res.status(400).json({ error: 'Full name, email, and project description are required.' });
      return;
    }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim());
    if (!emailValid) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }
    const db = readDb();
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
      fullName: body.fullName.trim().slice(0, 120),
      email: body.email.trim().slice(0, 160),
      phone: (body.phone || '').trim().slice(0, 60),
      projectType: (body.projectType || 'Residential Interior Design').trim(),
      propertyType: (body.propertyType || 'Private Residence').trim(),
      approximateArea: (body.approximateArea || '').trim().slice(0, 60),
      location: (body.location || '').trim().slice(0, 120),
      estimatedBudget: (body.estimatedBudget || '').trim().slice(0, 80),
      projectTimeline: (body.projectTimeline || '').trim().slice(0, 80),
      description: body.description.trim().slice(0, 4000),
      referenceFiles: Array.isArray(body.referenceFiles) ? body.referenceFiles.slice(0, 5) : [],
    };
    db.enquiries.unshift(newEnquiry);
    writeDb(db);
    res.status(201).json({ enquiry: newEnquiry });
  });

  app.post('/api/newsletter', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    const db = readDb();
    if (!db.subscribers.some((s) => s.email === email)) {
      db.subscribers.unshift({
        id: `sub-${Date.now()}`,
        email,
        subscribedAt: new Date().toISOString(),
      });
      writeDb(db);
    }
    res.status(201).json({ subscribed: true, email });
  });

  app.post('/api/admin/login', (req, res) => {
    const email = String(req.body?.email || 'elena@sorelspaces.com').trim();
    const passcode = String(req.body?.passcode || '').trim();
    if (passcode !== ADMIN_PASSCODE) {
      res.status(401).json({ error: 'Invalid studio access passcode.' });
      return;
    }
    const token = signToken(email);
    res.json({ token, user: { email, name: 'Elena Vance, AIA', role: 'Principal Architect' } });
  });

  app.get('/api/admin/state', requireAdmin, (_req, res) => {
    const db = readDb();
    res.json(db);
  });

  app.post('/api/admin/projects', requireAdmin, (req, res) => {
    const payload = req.body as Partial<Project>;
    if (!payload.title?.trim()) {
      res.status(400).json({ error: 'Project title is required.' });
      return;
    }
    const db = readDb();
    const baseSlug = slugify(payload.slug || payload.title);
    const uniqueSlug = db.projects.some((p) => p.slug === baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug;
    const project: Project = {
      id: `proj-${Date.now()}`,
      slug: uniqueSlug,
      title: payload.title.trim(),
      location: (payload.location || 'New York').trim(),
      category: (payload.category || 'Residential').trim(),
      year: (payload.year || '2026').trim(),
      area: (payload.area || '3,200 sq ft').trim(),
      duration: (payload.duration || '12 Months').trim(),
      shortDescription: (payload.shortDescription || '').trim(),
      overview: (payload.overview || payload.shortDescription || '').trim(),
      challenges: (payload.challenges || 'Balancing structural restraint with natural daylight distribution.').trim(),
      approach: (payload.approach || 'Bespoke architectural millwork, mineral plaster, and honed natural stone.').trim(),
      materials: Array.isArray(payload.materials) && payload.materials.length > 0 ? payload.materials : ['Roman Travertine', 'White Oak'],
      palette:
        Array.isArray(payload.palette) && payload.palette.length > 0
          ? payload.palette
          : [
              { name: 'Warm Ivory', hex: '#F4F1EA', finish: 'Limewash Plaster' },
              { name: 'Charcoal', hex: '#252521', finish: 'Patina Bronze' },
            ],
      heroImage: payload.heroImage || db.media[0]?.url || '/src/assets/images/hero_ivory_residence_1795368828776.jpg',
      gallery: Array.isArray(payload.gallery) && payload.gallery.length > 0 ? payload.gallery : [payload.heroImage || '/src/assets/images/hero_ivory_residence_1795368828776.jpg'],
      featured: Boolean(payload.featured),
      published: payload.published ?? true,
      heroSlide: Boolean(payload.heroSlide),
    };
    db.projects.unshift(project);
    writeDb(db);
    res.status(201).json({ project });
  });

  app.put('/api/admin/projects/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.projects.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    const existing = db.projects[idx];
    const updated: Project = {
      ...existing,
      ...req.body,
      id: existing.id,
    };
    db.projects[idx] = updated;
    writeDb(db);
    res.json({ project: updated });
  });

  app.delete('/api/admin/projects/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.projects = db.projects.filter((p) => p.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  app.put('/api/admin/categories', requireAdmin, (req, res) => {
    const categories = Array.isArray(req.body?.categories)
      ? (req.body.categories as string[]).map((c) => c.trim()).filter(Boolean)
      : [];
    if (categories.length === 0) {
      res.status(400).json({ error: 'At least one category is required.' });
      return;
    }
    const db = readDb();
    db.categories = Array.from(new Set(categories));
    writeDb(db);
    res.json({ categories: db.categories });
  });

  app.post('/api/admin/media', requireAdmin, (req, res) => {
    const { title, category, url, aspectRatio } = req.body as Partial<MediaAsset>;
    if (!title?.trim() || !url?.trim()) {
      res.status(400).json({ error: 'Asset title and image data or URL are required.' });
      return;
    }
    const db = readDb();
    const asset: MediaAsset = {
      id: `med-${Date.now()}`,
      title: title.trim(),
      category: (category || 'Portfolio').trim(),
      url: url.trim(),
      aspectRatio: aspectRatio || '4:3',
      addedAt: new Date().toISOString().slice(0, 10),
    };
    db.media.unshift(asset);
    writeDb(db);
    res.status(201).json({ asset });
  });

  app.delete('/api/admin/media/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.media = db.media.filter((m) => m.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  app.put('/api/admin/services/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Service not found.' });
      return;
    }
    db.services[idx] = { ...db.services[idx], ...req.body, id: db.services[idx].id };
    writeDb(db);
    res.json({ service: db.services[idx] });
  });

  app.post('/api/admin/team', requireAdmin, (req, res) => {
    const payload = req.body as Partial<TeamMember>;
    if (!payload.name?.trim() || !payload.role?.trim()) {
      res.status(400).json({ error: 'Team member name and role are required.' });
      return;
    }
    const db = readDb();
    const member: TeamMember = {
      id: `team-${Date.now()}`,
      name: payload.name.trim(),
      role: payload.role.trim(),
      discipline: payload.discipline || 'Design',
      location: (payload.location || 'New York').trim(),
      credentials: (payload.credentials || 'AIA · RIBA').trim(),
      bio: (payload.bio || '').trim(),
      image: payload.image || '/src/assets/images/team_elena_vance_1795368828932.jpg',
      featured: Boolean(payload.featured),
    };
    db.team.push(member);
    writeDb(db);
    res.status(201).json({ member });
  });

  app.put('/api/admin/team/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.team.findIndex((t) => t.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Team member not found.' });
      return;
    }
    db.team[idx] = { ...db.team[idx], ...req.body, id: db.team[idx].id };
    writeDb(db);
    res.json({ member: db.team[idx] });
  });

  app.delete('/api/admin/team/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.team = db.team.filter((t) => t.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  app.patch('/api/admin/enquiries/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.enquiries.findIndex((e) => e.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Enquiry not found.' });
      return;
    }
    if (req.body.status) {
      db.enquiries[idx].status = req.body.status;
    }
    writeDb(db);
    res.json({ enquiry: db.enquiries[idx] });
  });

  app.delete('/api/admin/enquiries/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.enquiries = db.enquiries.filter((e) => e.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  app.post('/api/admin/journal', requireAdmin, (req, res) => {
    const payload = req.body as Partial<JournalArticle>;
    if (!payload.title?.trim()) {
      res.status(400).json({ error: 'Article title is required.' });
      return;
    }
    const db = readDb();
    const baseSlug = slugify(payload.slug || payload.title);
    const article: JournalArticle = {
      id: `jrn-${Date.now()}`,
      slug: db.journal.some((j) => j.slug === baseSlug) ? `${baseSlug}-${Date.now()}` : baseSlug,
      title: payload.title.trim(),
      category: payload.category || 'Design Insights',
      publishedAt: payload.publishedAt || 'November 2026',
      readTime: payload.readTime || '5 min read',
      author: payload.author || 'Elena Vance, AIA',
      excerpt: (payload.excerpt || '').trim(),
      body: Array.isArray(payload.body) && payload.body.length > 0 ? payload.body : [payload.excerpt || 'Editorial essay.'],
      pullQuote: (payload.pullQuote || 'Architecture frames the quiet rituals of daily life.').trim(),
      image: payload.image || '/src/assets/images/journal_architectural_light_1795368829009.jpg',
      published: payload.published ?? true,
    };
    db.journal.unshift(article);
    writeDb(db);
    res.status(201).json({ article });
  });

  app.put('/api/admin/journal/:id', requireAdmin, (req, res) => {
    const db = readDb();
    const idx = db.journal.findIndex((j) => j.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Article not found.' });
      return;
    }
    db.journal[idx] = { ...db.journal[idx], ...req.body, id: db.journal[idx].id };
    writeDb(db);
    res.json({ article: db.journal[idx] });
  });

  app.delete('/api/admin/journal/:id', requireAdmin, (req, res) => {
    const db = readDb();
    db.journal = db.journal.filter((j) => j.id !== req.params.id);
    writeDb(db);
    res.json({ deleted: true });
  });

  app.put('/api/admin/content', requireAdmin, (req, res) => {
    const db = readDb();
    db.siteContent = { ...db.siteContent, ...req.body };
    writeDb(db);
    res.json({ siteContent: db.siteContent });
  });

  app.put('/api/admin/seo', requireAdmin, (req, res) => {
    const db = readDb();
    if (Array.isArray(req.body?.seo)) {
      db.seo = req.body.seo;
    }
    writeDb(db);
    res.json({ seo: db.seo });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sorel Spaces server listening on http://localhost:${PORT}`);
  });
}

startServer();
