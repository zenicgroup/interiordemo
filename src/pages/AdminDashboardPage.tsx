import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ExternalLink,
  FileText,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  Layers,
  Lock,
  LogOut,
  Mail,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import type {
  EnquiryStatus,
  JournalArticle,
  Project,
  SeoEntry,
  ServiceItem,
  SiteContent,
  StudioDatabase,
  TeamMember,
} from '../types/studio';

type AdminModule =
  | 'overview'
  | 'projects'
  | 'categories'
  | 'media'
  | 'services'
  | 'team'
  | 'enquiries'
  | 'journal'
  | 'content'
  | 'seo';

const TOKEN_STORAGE_KEY = 'sorel_admin_token';

const MODULES: { id: AdminModule; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'categories', label: 'Categories', icon: Layers },
  { id: 'media', label: 'Image Gallery', icon: ImageIcon },
  { id: 'services', label: 'Services', icon: Settings },
  { id: 'team', label: 'Team Profiles', icon: Users },
  { id: 'enquiries', label: 'Client Enquiries', icon: Mail },
  { id: 'journal', label: 'Journal', icon: FileText },
  { id: 'content', label: 'Website Content', icon: Globe },
  { id: 'seo', label: 'SEO Management', icon: Search },
];

export function AdminDashboardPage() {
  const { refreshData } = useStudio();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [loginEmail, setLoginEmail] = useState('elena@sorelspaces.com');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeModule, setActiveModule] = useState<AdminModule>('overview');
  const [db, setDb] = useState<StudioDatabase | null>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Module-specific local editor states
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState('Residential');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingTeam, setEditingTeam] = useState<Partial<TeamMember> | null>(null);
  const [editingJournal, setEditingJournal] = useState<Partial<JournalArticle> | null>(null);
  const [contentDraft, setContentDraft] = useState<SiteContent | null>(null);
  const [seoDraft, setSeoDraft] = useState<SeoEntry[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<string>('All');

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const authHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const fetchAdminState = useCallback(async () => {
    if (!token) return;
    setLoadingDb(true);
    try {
      const res = await fetch('/api/admin/state', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        return;
      }
      if (res.ok) {
        const data = (await res.json()) as StudioDatabase;
        setDb(data);
        setContentDraft(data.siteContent);
        setSeoDraft(data.seo);
      }
    } finally {
      setLoadingDb(false);
    }
  }, [token]);

  useEffect(() => {
    document.title = 'Studio CMS | Sorel Spaces';
    void fetchAdminState();
  }, [fetchAdminState]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, passcode: loginPasscode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Authentication failed.');
      localStorage.setItem(TOKEN_STORAGE_KEY, json.token);
      setToken(json.token);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setDb(null);
  };

  // Sign-in gate
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] text-[#252521] flex items-center justify-center px-5 py-24">
        <div className="max-w-md w-full bg-[#FFFFFF] border border-[#252521]/15 p-8 sm:p-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#A69B8B]">Protected CMS</span>
              <Lock className="w-4 h-4 text-[#252521]/50" />
            </div>
            <h1 className="font-serif text-3xl font-light">Sorel Spaces Admin</h1>
            <p className="text-xs text-[#252521]/65 leading-relaxed">
              Sign in to manage portfolio commissions, editorial journal essays, client enquiries, and studio metadata.
            </p>
          </div>

          {loginError && (
            <div className="p-3 border border-[#8B3A3A]/40 bg-[#8B3A3A]/5 text-xs text-[#6E2626]">{loginError}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] tracking-[0.16em] uppercase text-[#252521]/65 mb-1">
                Studio Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border-b border-[#252521]/25 py-2.5 text-sm focus:outline-none focus:border-[#252521]"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.16em] uppercase text-[#252521]/65 mb-1">
                Access Passcode
              </label>
              <input
                type="password"
                required
                value={loginPasscode}
                onChange={(e) => setLoginPasscode(e.target.value)}
                placeholder="Enter studio passcode"
                className="w-full border-b border-[#252521]/25 py-2.5 text-sm focus:outline-none focus:border-[#252521]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.18em] uppercase hover:bg-[#3A3A34] transition-colors cursor-pointer"
            >
              {loggingIn ? 'Verifying...' : 'Enter Studio CMS'}
            </button>
          </form>

          <div className="pt-4 border-t border-[#252521]/10 flex items-center justify-between text-xs text-[#252521]/60">
            <span>Demo Passcode: SOREL2026</span>
            <button
              type="button"
              onClick={() => setLoginPasscode('SOREL2026')}
              className="underline underline-offset-4 hover:text-[#252521] cursor-pointer"
            >
              Fill Passcode
            </button>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs tracking-[0.16em] uppercase text-[#A69B8B] hover:text-[#252521]">
              ← Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Action handlers
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    const isUpdate = Boolean(editingProject.id);
    const url = isUpdate ? `/api/admin/projects/${editingProject.id}` : '/api/admin/projects';
    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(editingProject),
    });
    if (res.ok) {
      setEditingProject(null);
      await fetchAdminState();
      await refreshData();
      notify(isUpdate ? 'Project updated and synced.' : 'New project published.');
    }
  };

  const toggleProjectPublished = async (proj: Project) => {
    const res = await fetch(`/api/admin/projects/${proj.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ published: !proj.published }),
    });
    if (res.ok) {
      await fetchAdminState();
      await refreshData();
      notify(`"${proj.title}" marked as ${!proj.published ? 'Published' : 'Draft'}.`);
    }
  };

  const deleteProject = async (id: string) => {
    const res = await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      await fetchAdminState();
      await refreshData();
      notify('Project removed from archive.');
    }
  };

  const saveCategories = async (categories: string[]) => {
    const res = await fetch('/api/admin/categories', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ categories }),
    });
    if (res.ok) {
      await fetchAdminState();
      await refreshData();
      notify('Project categories updated.');
    }
  };

  const handleMediaFileUpload = async (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewMediaUrl(String(reader.result || ''));
      if (!newMediaTitle) setNewMediaTitle(file.name.replace(/\.[^.]+$/, ''));
    };
    reader.readAsDataURL(file);
  };

  const saveMediaAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim() || !newMediaUrl.trim()) return;
    const res = await fetch('/api/admin/media', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        title: newMediaTitle,
        category: newMediaCategory,
        url: newMediaUrl,
        aspectRatio: '4:3',
      }),
    });
    if (res.ok) {
      setNewMediaTitle('');
      setNewMediaUrl('');
      await fetchAdminState();
      notify('Image asset added to gallery.');
    }
  };

  const deleteMediaAsset = async (id: string) => {
    const res = await fetch(`/api/admin/media/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      await fetchAdminState();
      notify('Image asset deleted.');
    }
  };

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    const res = await fetch(`/api/admin/services/${editingService.id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(editingService),
    });
    if (res.ok) {
      setEditingService(null);
      await fetchAdminState();
      await refreshData();
      notify('Service details saved.');
    }
  };

  const saveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam?.name) return;
    const isUpdate = Boolean(editingTeam.id);
    const url = isUpdate ? `/api/admin/team/${editingTeam.id}` : '/api/admin/team';
    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(editingTeam),
    });
    if (res.ok) {
      setEditingTeam(null);
      await fetchAdminState();
      await refreshData();
      notify(isUpdate ? 'Team profile updated.' : 'Specialist profile added.');
    }
  };

  const deleteTeamMember = async (id: string) => {
    const res = await fetch(`/api/admin/team/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      await fetchAdminState();
      await refreshData();
      notify('Team profile removed.');
    }
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      await fetchAdminState();
      notify(`Enquiry status updated to ${status}.`);
    }
  };

  const deleteEnquiry = async (id: string) => {
    const res = await fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      await fetchAdminState();
      notify('Enquiry deleted.');
    }
  };

  const saveJournalArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJournal?.title) return;
    const isUpdate = Boolean(editingJournal.id);
    const url = isUpdate ? `/api/admin/journal/${editingJournal.id}` : '/api/admin/journal';
    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify(editingJournal),
    });
    if (res.ok) {
      setEditingJournal(null);
      await fetchAdminState();
      await refreshData();
      notify(isUpdate ? 'Journal article updated.' : 'Journal article published.');
    }
  };

  const deleteJournalArticle = async (id: string) => {
    const res = await fetch(`/api/admin/journal/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      await fetchAdminState();
      await refreshData();
      notify('Journal article deleted.');
    }
  };

  const saveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentDraft) return;
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(contentDraft),
    });
    if (res.ok) {
      await fetchAdminState();
      await refreshData();
      notify('Website copy updated across live site.');
    }
  };

  const saveSeoEntries = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/seo', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ seo: seoDraft }),
    });
    if (res.ok) {
      await fetchAdminState();
      await refreshData();
      notify('SEO metadata saved.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#252521] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#252521] text-[#F4F1EA] flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-6">
          <div className="pb-5 border-b border-[#F4F1EA]/15">
            <Link to="/" className="font-serif text-xl tracking-[0.14em] uppercase block">
              SOREL SPACES
            </Link>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#A69B8B] mt-1">Studio CMS</p>
          </div>

          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0" aria-label="Admin modules">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const active = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setActiveModule(mod.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-xs tracking-[0.08em] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'bg-[#F4F1EA] text-[#252521] font-medium' : 'text-[#F4F1EA]/75 hover:bg-[#F4F1EA]/10'
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[1.5] shrink-0" />
                  <span>{mod.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-[#F4F1EA]/15 flex lg:flex-col gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#F4F1EA]/25 text-xs tracking-[0.14em] uppercase hover:bg-[#F4F1EA] hover:text-[#252521] transition-colors"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs tracking-[0.14em] uppercase text-[#D9CCB8] hover:text-[#FFFFFF] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-[#FFFFFF] border-b border-[#252521]/10 px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#252521]/60">
            <span>Studio CMS</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#252521] font-medium capitalize">
              {MODULES.find((m) => m.id === activeModule)?.label}
            </span>
          </div>
          {toast && (
            <div className="inline-flex items-center gap-2 bg-[#252521] text-[#F4F1EA] px-4 py-1.5 text-xs">
              <Check className="w-3.5 h-3.5 text-[#D9CCB8]" />
              <span>{toast}</span>
            </div>
          )}
        </header>

        <main className="flex-1 p-6 lg:p-10 max-w-6xl w-full space-y-8">
          {loadingDb && !db ? (
            <div className="py-20 text-center text-sm text-[#252521]/60">Loading studio database...</div>
          ) : !db ? null : (
            <>
              {/* 1. OVERVIEW */}
              {activeModule === 'overview' && (
                <div className="space-y-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h1 className="font-serif text-3xl font-light">Studio Overview</h1>
                      <p className="text-xs text-[#252521]/60 mt-1">
                        Live summary of portfolio records, client consultation briefs, and editorial content.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModule('projects');
                          setEditingProject({
                            title: '',
                            location: '',
                            category: db.categories[0] || 'Residential',
                            year: '2026',
                            area: '',
                            duration: '12 Months',
                            shortDescription: '',
                            overview: '',
                            heroImage: db.media[0]?.url || '',
                            published: true,
                            featured: true,
                          });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.14em] uppercase cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Project</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { label: 'Projects', value: db.projects.length },
                      { label: 'Client Enquiries', value: db.enquiries.length },
                      { label: 'Journal Essays', value: db.journal.length },
                      { label: 'Team Specialists', value: db.team.length },
                      { label: 'Subscribers', value: db.subscribers.length },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-[#FFFFFF] border border-[#252521]/10 p-5">
                        <p className="text-[11px] tracking-[0.14em] uppercase text-[#A69B8B]">{stat.label}</p>
                        <p className="font-serif text-3xl mt-2 tabular-nums">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#FFFFFF] border border-[#252521]/10 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-2xl">Recent Consultation Enquiries</h2>
                      <button
                        type="button"
                        onClick={() => setActiveModule('enquiries')}
                        className="text-xs tracking-[0.14em] uppercase underline underline-offset-4 cursor-pointer"
                      >
                        Manage All
                      </button>
                    </div>
                    <div className="divide-y divide-[#252521]/10">
                      {db.enquiries.slice(0, 4).map((enq) => (
                        <div key={enq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium">{enq.fullName}</p>
                            <p className="text-xs text-[#252521]/60">
                              {enq.projectType} · {enq.location || 'Location pending'} · {enq.estimatedBudget}
                            </p>
                          </div>
                          <span className="text-xs text-[#A69B8B]">{enq.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PROJECT MANAGEMENT */}
              {activeModule === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <h1 className="font-serif text-3xl font-light">Project Management</h1>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingProject({
                          title: '',
                          location: '',
                          category: db.categories[0] || 'Residential',
                          year: '2026',
                          area: '3,500 sq ft',
                          duration: '12 Months',
                          shortDescription: '',
                          overview: '',
                          challenges: '',
                          approach: '',
                          heroImage: db.media[0]?.url || '',
                          published: true,
                          featured: true,
                          heroSlide: false,
                        })
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.14em] uppercase cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Project</span>
                    </button>
                  </div>

                  {editingProject && (
                    <form onSubmit={saveProject} className="bg-[#FFFFFF] border border-[#252521]/15 p-6 space-y-5">
                      <div className="flex items-center justify-between border-b border-[#252521]/10 pb-3">
                        <h2 className="font-serif text-2xl">
                          {editingProject.id ? `Edit ${editingProject.title}` : 'New Portfolio Project'}
                        </h2>
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="text-xs uppercase tracking-wider text-[#252521]/60 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                            Title *
                          </label>
                          <input
                            required
                            value={editingProject.title || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                            Location
                          </label>
                          <input
                            value={editingProject.location || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                            className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                            Category
                          </label>
                          <select
                            value={editingProject.category || db.categories[0]}
                            onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                            className="w-full border border-[#252521]/20 px-3 py-2 text-sm bg-white"
                          >
                            {db.categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                            Year
                          </label>
                          <input
                            value={editingProject.year || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                            className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                            Area
                          </label>
                          <input
                            value={editingProject.area || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                            className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                            Hero Plate from Gallery
                          </label>
                          <select
                            value={editingProject.heroImage || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, heroImage: e.target.value })}
                            className="w-full border border-[#252521]/20 px-3 py-2 text-sm bg-white"
                          >
                            {db.media.map((m) => (
                              <option key={m.id} value={m.url}>
                                {m.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                          Short Description
                        </label>
                        <textarea
                          rows={2}
                          value={editingProject.shortDescription || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, shortDescription: e.target.value })}
                          className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#252521]/60 mb-1">
                          Architectural Overview
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.overview || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
                          className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-6 text-xs">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingProject.published ?? true}
                            onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                          />
                          <span>Published on Live Portfolio</span>
                        </label>
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingProject.heroSlide)}
                            onChange={(e) => setEditingProject({ ...editingProject, heroSlide: e.target.checked })}
                          />
                          <span>Include in Homepage Hero Slides</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.16em] uppercase cursor-pointer"
                      >
                        Save Project
                      </button>
                    </form>
                  )}

                  <div className="bg-[#FFFFFF] border border-[#252521]/10 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-[#252521]/10 text-[11px] uppercase tracking-wider text-[#A69B8B]">
                        <tr>
                          <th className="py-3 px-4">Project</th>
                          <th className="py-3 px-4">Location</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Year</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#252521]/10">
                        {db.projects.map((p) => (
                          <tr key={p.id} className="hover:bg-[#F4F1EA]/50">
                            <td className="py-3 px-4 font-medium">{p.title}</td>
                            <td className="py-3 px-4 text-xs text-[#252521]/70">{p.location}</td>
                            <td className="py-3 px-4 text-xs">{p.category}</td>
                            <td className="py-3 px-4 text-xs tabular-nums">{p.year}</td>
                            <td className="py-3 px-4 text-xs">
                              <button
                                type="button"
                                onClick={() => void toggleProjectPublished(p)}
                                className="underline underline-offset-4 cursor-pointer"
                              >
                                {p.published ? 'Published' : 'Draft'}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right space-x-3 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setEditingProject(p)}
                                className="text-xs underline underline-offset-4 cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => void deleteProject(p.id)}
                                className="text-xs text-[#8B3A3A] hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. CATEGORIES */}
              {activeModule === 'categories' && (
                <div className="space-y-6 max-w-2xl">
                  <h1 className="font-serif text-3xl font-light">Project Categories</h1>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCategory.trim()) return;
                      void saveCategories([...db.categories, newCategory.trim()]);
                      setNewCategory('');
                    }}
                    className="flex gap-3"
                  >
                    <input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add discipline category (e.g. Hospitality)"
                      className="flex-1 bg-[#FFFFFF] border border-[#252521]/20 px-4 py-2.5 text-sm"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.14em] uppercase cursor-pointer"
                    >
                      Add
                    </button>
                  </form>

                  <div className="bg-[#FFFFFF] border border-[#252521]/10 divide-y divide-[#252521]/10">
                    {db.categories.map((cat) => {
                      const count = db.projects.filter((p) => p.category === cat).length;
                      return (
                        <div key={cat} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{cat}</p>
                            <p className="text-xs text-[#252521]/55 tabular-nums">{count} projects</p>
                          </div>
                          {db.categories.length > 1 && (
                            <button
                              type="button"
                              onClick={() => void saveCategories(db.categories.filter((c) => c !== cat))}
                              className="text-xs text-[#8B3A3A] hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. IMAGE GALLERY */}
              {activeModule === 'media' && (
                <div className="space-y-8">
                  <h1 className="font-serif text-3xl font-light">Architectural Image Gallery</h1>

                  <form onSubmit={saveMediaAsset} className="bg-[#FFFFFF] border border-[#252521]/10 p-6 space-y-4">
                    <p className="text-xs tracking-[0.16em] uppercase text-[#A69B8B]">Upload or Register Plate</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        required
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        placeholder="Plate title"
                        className="border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                      <input
                        value={newMediaCategory}
                        onChange={(e) => setNewMediaCategory(e.target.value)}
                        placeholder="Category"
                        className="border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                      <label className="flex items-center justify-center gap-2 border border-dashed border-[#252521]/30 px-3 py-2 text-xs cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{newMediaUrl ? 'Image Selected' : 'Upload Local Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => void handleMediaFileUpload(e.target.files?.[0])}
                        />
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={!newMediaUrl || !newMediaTitle}
                      className="px-5 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.14em] uppercase disabled:opacity-40 cursor-pointer"
                    >
                      Save to Media Library
                    </button>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {db.media.map((asset) => (
                      <div key={asset.id} className="bg-[#FFFFFF] border border-[#252521]/10 overflow-hidden">
                        <img src={asset.url} alt={asset.title} className="w-full aspect-[4/3] object-cover" />
                        <div className="p-4 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{asset.title}</p>
                            <p className="text-xs text-[#A69B8B]">
                              {asset.category} · {asset.addedAt}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => void deleteMediaAsset(asset.id)}
                            aria-label={`Delete ${asset.title}`}
                            className="p-2 text-[#252521]/50 hover:text-[#8B3A3A] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. SERVICES */}
              {activeModule === 'services' && (
                <div className="space-y-6">
                  <h1 className="font-serif text-3xl font-light">Service Management</h1>

                  {editingService && (
                    <form onSubmit={saveService} className="bg-[#FFFFFF] border border-[#252521]/15 p-6 space-y-4">
                      <div className="flex justify-between">
                        <h2 className="font-serif text-2xl">Edit {editingService.title}</h2>
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
                          className="text-xs uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          value={editingService.title}
                          onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                          className="border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                        <input
                          value={editingService.subtitle}
                          onChange={(e) => setEditingService({ ...editingService, subtitle: e.target.value })}
                          className="border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                      </div>
                      <textarea
                        rows={3}
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                      <input
                        value={editingService.deliverables}
                        onChange={(e) => setEditingService({ ...editingService, deliverables: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs uppercase tracking-widest cursor-pointer"
                      >
                        Save Service
                      </button>
                    </form>
                  )}

                  <div className="bg-[#FFFFFF] border border-[#252521]/10 divide-y divide-[#252521]/10">
                    {db.services.map((svc) => (
                      <div key={svc.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-[#A69B8B] tabular-nums">
                            {svc.number} · {svc.subtitle}
                          </p>
                          <h3 className="font-serif text-xl">{svc.title}</h3>
                          <p className="text-xs text-[#252521]/70 max-w-2xl">{svc.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingService(svc)}
                          className="text-xs tracking-[0.14em] uppercase underline underline-offset-4 shrink-0 cursor-pointer"
                        >
                          Edit Service
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. TEAM PROFILES */}
              {activeModule === 'team' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="font-serif text-3xl font-light">Team Profiles</h1>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingTeam({
                          name: '',
                          role: '',
                          discipline: 'Architecture',
                          location: 'New York',
                          credentials: '',
                          bio: '',
                          image: db.team[0]?.image || '',
                        })
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs uppercase tracking-widest cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Specialist</span>
                    </button>
                  </div>

                  {editingTeam && (
                    <form onSubmit={saveTeamMember} className="bg-[#FFFFFF] border border-[#252521]/15 p-6 space-y-4">
                      <div className="flex justify-between">
                        <h2 className="font-serif text-2xl">{editingTeam.id ? 'Edit Profile' : 'Add Specialist'}</h2>
                        <button type="button" onClick={() => setEditingTeam(null)} className="text-xs uppercase">
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          required
                          placeholder="Full Name"
                          value={editingTeam.name || ''}
                          onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                          className="border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                        <input
                          required
                          placeholder="Role / Title"
                          value={editingTeam.role || ''}
                          onChange={(e) => setEditingTeam({ ...editingTeam, role: e.target.value })}
                          className="border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                        <select
                          value={editingTeam.discipline || 'Architecture'}
                          onChange={(e) =>
                            setEditingTeam({ ...editingTeam, discipline: e.target.value as TeamMember['discipline'] })
                          }
                          className="border border-[#252521]/20 px-3 py-2 text-sm bg-white"
                        >
                          <option value="Architecture">Architecture</option>
                          <option value="Design">Design</option>
                          <option value="Project Management">Project Management</option>
                          <option value="Technical">Technical</option>
                        </select>
                        <input
                          placeholder="Location"
                          value={editingTeam.location || ''}
                          onChange={(e) => setEditingTeam({ ...editingTeam, location: e.target.value })}
                          className="border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Biography"
                        value={editingTeam.bio || ''}
                        onChange={(e) => setEditingTeam({ ...editingTeam, bio: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs uppercase tracking-widest cursor-pointer"
                      >
                        Save Profile
                      </button>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {db.team.map((member) => (
                      <div key={member.id} className="bg-[#FFFFFF] border border-[#252521]/10 p-5 flex gap-4">
                        <img src={member.image} alt={member.name} className="w-20 h-24 object-cover shrink-0" />
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-[#A69B8B]">
                            {member.discipline} · {member.location}
                          </p>
                          <h3 className="font-serif text-xl">{member.name}</h3>
                          <p className="text-xs text-[#252521]/65">{member.role}</p>
                          <div className="pt-2 flex gap-4 text-xs">
                            <button
                              type="button"
                              onClick={() => setEditingTeam(member)}
                              className="underline underline-offset-4 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteTeamMember(member.id)}
                              className="text-[#8B3A3A] hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. CLIENT ENQUIRIES */}
              {activeModule === 'enquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="font-serif text-3xl font-light">Client Consultation Enquiries</h1>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {['All', 'New', 'In Review', 'Consultation Scheduled', 'Archived'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setEnquiryFilter(status)}
                          className={`pb-1 border-b cursor-pointer ${
                            enquiryFilter === status ? 'border-[#252521] font-medium' : 'border-transparent text-[#252521]/55'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {db.enquiries
                      .filter((e) => enquiryFilter === 'All' || e.status === enquiryFilter)
                      .map((enq) => (
                        <div key={enq.id} className="bg-[#FFFFFF] border border-[#252521]/10 p-6 space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#252521]/10 pb-4">
                            <div>
                              <p className="text-xs text-[#A69B8B] tabular-nums">
                                {enq.id} · {new Date(enq.createdAt).toLocaleDateString()}
                              </p>
                              <h2 className="font-serif text-2xl mt-0.5">{enq.fullName}</h2>
                              <p className="text-xs text-[#252521]/70">
                                {enq.email} {enq.phone ? `· ${enq.phone}` : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <select
                                value={enq.status}
                                onChange={(e) => void updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                                className="border border-[#252521]/20 px-3 py-1.5 text-xs bg-white"
                              >
                                <option value="New">New</option>
                                <option value="In Review">In Review</option>
                                <option value="Consultation Scheduled">Consultation Scheduled</option>
                                <option value="Archived">Archived</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => void deleteEnquiry(enq.id)}
                                className="p-2 text-[#252521]/50 hover:text-[#8B3A3A] cursor-pointer"
                                aria-label="Delete enquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                            <div>
                              <span className="block text-[#A69B8B] uppercase">Project Type</span>
                              <span className="font-medium">{enq.projectType}</span>
                            </div>
                            <div>
                              <span className="block text-[#A69B8B] uppercase">Property</span>
                              <span className="font-medium">{enq.propertyType}</span>
                            </div>
                            <div>
                              <span className="block text-[#A69B8B] uppercase">Area</span>
                              <span className="font-medium tabular-nums">{enq.approximateArea || '—'}</span>
                            </div>
                            <div>
                              <span className="block text-[#A69B8B] uppercase">Budget</span>
                              <span className="font-medium tabular-nums">{enq.estimatedBudget || '—'}</span>
                            </div>
                            <div>
                              <span className="block text-[#A69B8B] uppercase">Timeline</span>
                              <span className="font-medium">{enq.projectTimeline || '—'}</span>
                            </div>
                          </div>

                          <p className="text-sm text-[#252521]/80 leading-relaxed">{enq.description}</p>

                          {enq.referenceFiles && enq.referenceFiles.length > 0 && (
                            <div className="pt-2 space-y-2">
                              <p className="text-[11px] uppercase tracking-wider text-[#A69B8B]">
                                Attached Client Reference Images ({enq.referenceFiles.length})
                              </p>
                              <div className="flex flex-wrap gap-3">
                                {enq.referenceFiles.map((rf, i) => (
                                  <div key={`${rf.name}-${i}`} className="border border-[#252521]/15 p-1.5 bg-[#F4F1EA]/40">
                                    {rf.type.startsWith('image/') && (
                                      <img src={rf.dataUrl} alt={rf.name} className="w-24 h-16 object-cover mb-1" />
                                    )}
                                    <p className="text-[11px] max-w-[96px] truncate">{rf.name}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* 8. JOURNAL MANAGEMENT */}
              {activeModule === 'journal' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="font-serif text-3xl font-light">Journal Management</h1>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingJournal({
                          title: '',
                          category: 'Design Insights',
                          author: 'Elena Vance, AIA',
                          readTime: '5 min read',
                          excerpt: '',
                          pullQuote: '',
                          body: [''],
                          image: db.media[8]?.url || db.media[0]?.url || '',
                          published: true,
                        })
                      }
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs uppercase tracking-widest cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Essay</span>
                    </button>
                  </div>

                  {editingJournal && (
                    <form onSubmit={saveJournalArticle} className="bg-[#FFFFFF] border border-[#252521]/15 p-6 space-y-4">
                      <div className="flex justify-between">
                        <h2 className="font-serif text-2xl">{editingJournal.id ? 'Edit Essay' : 'New Essay'}</h2>
                        <button type="button" onClick={() => setEditingJournal(null)} className="text-xs uppercase">
                          Cancel
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          required
                          placeholder="Essay Title"
                          value={editingJournal.title || ''}
                          onChange={(e) => setEditingJournal({ ...editingJournal, title: e.target.value })}
                          className="md:col-span-2 border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                        <select
                          value={editingJournal.category || 'Design Insights'}
                          onChange={(e) =>
                            setEditingJournal({
                              ...editingJournal,
                              category: e.target.value as JournalArticle['category'],
                            })
                          }
                          className="border border-[#252521]/20 px-3 py-2 text-sm bg-white"
                        >
                          <option value="Lighting Design">Lighting Design</option>
                          <option value="Material Guides">Material Guides</option>
                          <option value="Space Planning">Space Planning</option>
                          <option value="Interior Inspiration">Interior Inspiration</option>
                          <option value="Architecture Trends">Architecture Trends</option>
                          <option value="Design Insights">Design Insights</option>
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Excerpt"
                        value={editingJournal.excerpt || ''}
                        onChange={(e) => setEditingJournal({ ...editingJournal, excerpt: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                      <textarea
                        rows={4}
                        placeholder="Essay body paragraphs (separate paragraphs with blank line)"
                        value={(editingJournal.body || []).join('\n\n')}
                        onChange={(e) =>
                          setEditingJournal({
                            ...editingJournal,
                            body: e.target.value.split(/\n\s*\n/).filter(Boolean),
                          })
                        }
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs uppercase tracking-widest cursor-pointer"
                      >
                        Publish Essay
                      </button>
                    </form>
                  )}

                  <div className="bg-[#FFFFFF] border border-[#252521]/10 divide-y divide-[#252521]/10">
                    {db.journal.map((art) => (
                      <div key={art.id} className="p-5 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-[#A69B8B]">
                            {art.category} · {art.publishedAt} · {art.author}
                          </p>
                          <h3 className="font-serif text-xl">{art.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-xs shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditingJournal(art)}
                            className="underline underline-offset-4 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteJournalArticle(art.id)}
                            className="text-[#8B3A3A] hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 9. WEBSITE CONTENT */}
              {activeModule === 'content' && contentDraft && (
                <form onSubmit={saveSiteContent} className="space-y-6 max-w-3xl bg-[#FFFFFF] border border-[#252521]/10 p-8">
                  <h1 className="font-serif text-3xl font-light">Website Copy & Brand Content</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                        Brand Wordmark
                      </label>
                      <input
                        value={contentDraft.brandName}
                        onChange={(e) => setContentDraft({ ...contentDraft, brandName: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                        Studio Tagline
                      </label>
                      <input
                        value={contentDraft.tagline}
                        onChange={(e) => setContentDraft({ ...contentDraft, tagline: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                      Hero Headline
                    </label>
                    <input
                      value={contentDraft.heroHeadline}
                      onChange={(e) => setContentDraft({ ...contentDraft, heroHeadline: e.target.value })}
                      className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                      Hero Supporting Text
                    </label>
                    <textarea
                      rows={2}
                      value={contentDraft.heroSubheadline}
                      onChange={(e) => setContentDraft({ ...contentDraft, heroSubheadline: e.target.value })}
                      className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                      Studio Introduction Headline
                    </label>
                    <input
                      value={contentDraft.introHeadline}
                      onChange={(e) => setContentDraft({ ...contentDraft, introHeadline: e.target.value })}
                      className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                      Studio Introduction Narrative
                    </label>
                    <textarea
                      rows={3}
                      value={contentDraft.introBody}
                      onChange={(e) => setContentDraft({ ...contentDraft, introBody: e.target.value })}
                      className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                        Studio Email
                      </label>
                      <input
                        value={contentDraft.studioEmail}
                        onChange={(e) => setContentDraft({ ...contentDraft, studioEmail: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A69B8B] mb-1">
                        Studio Telephone
                      </label>
                      <input
                        value={contentDraft.studioPhone}
                        onChange={(e) => setContentDraft({ ...contentDraft, studioPhone: e.target.value })}
                        className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.16em] uppercase cursor-pointer"
                  >
                    Publish Content Changes
                  </button>
                </form>
              )}

              {/* 10. SEO MANAGEMENT */}
              {activeModule === 'seo' && (
                <form onSubmit={saveSeoEntries} className="space-y-6 max-w-4xl">
                  <div className="flex items-center justify-between">
                    <h1 className="font-serif text-3xl font-light">SEO Metadata Management</h1>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.16em] uppercase cursor-pointer"
                    >
                      Save All SEO Rules
                    </button>
                  </div>

                  <div className="space-y-4">
                    {seoDraft.map((entry, idx) => (
                      <div key={entry.route} className="bg-[#FFFFFF] border border-[#252521]/10 p-6 space-y-4">
                        <div className="flex items-center justify-between text-xs text-[#A69B8B]">
                          <span className="font-medium text-[#252521]">{entry.pageName}</span>
                          <span>Route: {entry.route}</span>
                        </div>
                        <input
                          value={entry.title}
                          onChange={(e) => {
                            const next = [...seoDraft];
                            next[idx] = { ...entry, title: e.target.value };
                            setSeoDraft(next);
                          }}
                          placeholder="Meta Title"
                          className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                        <textarea
                          rows={2}
                          value={entry.description}
                          onChange={(e) => {
                            const next = [...seoDraft];
                            next[idx] = { ...entry, description: e.target.value };
                            setSeoDraft(next);
                          }}
                          placeholder="Meta Description"
                          className="w-full border border-[#252521]/20 px-3 py-2 text-sm"
                        />
                        <input
                          value={entry.keywords}
                          onChange={(e) => {
                            const next = [...seoDraft];
                            next[idx] = { ...entry, keywords: e.target.value };
                            setSeoDraft(next);
                          }}
                          placeholder="Keywords"
                          className="w-full border border-[#252521]/20 px-3 py-2 text-xs text-[#252521]/75"
                        />
                      </div>
                    ))}
                  </div>
                </form>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
