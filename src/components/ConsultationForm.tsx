import React, { useState } from 'react';
import { ArrowRight, Check, Upload, X } from 'lucide-react';
import type { UploadedReferenceFile } from '../types/studio';

interface ConsultationFormProps {
  defaultProjectType?: string;
  compact?: boolean;
}

const PROJECT_TYPES = [
  'Residential Interior Design',
  'Commercial Interior Design',
  'Architectural Design',
  'Turnkey Interior Solutions',
  'Renovation & Remodeling',
  'Space Planning',
  'Furniture & Styling',
  '3D Visualization',
];

const PROPERTY_TYPES = [
  'Private Townhouse',
  'Penthouse Residence',
  'Coastal / Country Villa',
  'Apartment / Loft',
  'Boutique Hotel / Hospitality',
  'Executive Workspace',
  'Retail Gallery',
];

const BUDGET_RANGES = [
  '$250k – $500k',
  '$500k – $1M',
  '$1M – $2.5M',
  '$2.5M – $5M+',
  'Advisory / Consultation Only',
];

const TIMELINES = [
  'Immediate (1–2 Months)',
  'Q1–Q2 Upcoming (3–6 Months)',
  'Long-Term Planning (6–12 Months)',
  'Ground-Up Build (12–24 Months)',
];

export function ConsultationForm({ defaultProjectType = '', compact = false }: ConsultationFormProps) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    projectType: defaultProjectType || PROJECT_TYPES[0],
    propertyType: PROPERTY_TYPES[0],
    approximateArea: '',
    location: '',
    estimatedBudget: BUDGET_RANGES[1],
    projectTimeline: TIMELINES[1],
    description: '',
  });

  const [files, setFiles] = useState<UploadedReferenceFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleFileChange = async (fileList: FileList | null) => {
    if (!fileList) return;
    const selected = Array.from(fileList).slice(0, 5 - files.length);
    const loaded: UploadedReferenceFile[] = [];

    for (const file of selected) {
      if (file.size > 4 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 4 MB reference file limit.`);
        continue;
      }
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.readAsDataURL(file);
      });
      loaded.push({
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl,
      });
    }
    setFiles((prev) => [...prev, ...loaded].slice(0, 5));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.email.trim() || !form.description.trim()) {
      setError('Please complete your full name, email address, and project description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, referenceFiles: files }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Unable to submit enquiry.');
      }
      setSubmittedId(json.enquiry?.id || 'ENQ-CONFIRMED');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        projectType: defaultProjectType || PROJECT_TYPES[0],
        propertyType: PROPERTY_TYPES[0],
        approximateArea: '',
        location: '',
        estimatedBudget: BUDGET_RANGES[1],
        projectTimeline: TIMELINES[1],
        description: '',
      });
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission error. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="border border-[#252521]/20 bg-[#FFFFFF] p-8 md:p-12 space-y-6">
        <div className="w-10 h-10 border border-[#252521] flex items-center justify-center">
          <Check className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <p className="text-xs tracking-[0.18em] uppercase text-[#A69B8B]">
            Commission Dossier Received · {submittedId}
          </p>
          <h3 className="font-serif text-3xl text-[#252521]">Thank you for sharing your vision.</h3>
          <p className="text-sm text-[#252521]/75 leading-relaxed max-w-xl">
            Our senior architectural partners review every commission personally and will respond within two business days to schedule an initial private consultation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmittedId(null)}
          className="inline-flex items-center gap-3 px-6 py-3 border border-[#252521] text-xs tracking-[0.16em] uppercase hover:bg-[#252521] hover:text-[#F4F1EA] transition-colors cursor-pointer"
        >
          <span>Submit Another Brief</span>
        </button>
      </div>
    );
  }

  const inputClass =
    'w-full bg-transparent border-b border-[#252521]/25 py-3 text-sm text-[#252521] placeholder:text-[#252521]/40 focus:outline-none focus:border-[#252521] transition-colors';
  const labelClass = 'block text-[11px] tracking-[0.16em] uppercase text-[#252521]/65 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {error && (
        <div className="p-4 border border-[#8B3A3A]/40 bg-[#8B3A3A]/5 text-sm text-[#6E2626]" role="alert">
          {error}
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-x-8 gap-y-6`}>
        <div>
          <label className={labelClass} htmlFor="enq-fullname">
            Full Name *
          </label>
          <input
            id="enq-fullname"
            type="text"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Elena Lindholm"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-email">
            Email Address *
          </label>
          <input
            id="enq-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="name@domain.com"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-phone">
            Phone Number
          </label>
          <input
            id="enq-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+1 (212) 555-0192"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-project-type">
            Project Type
          </label>
          <select
            id="enq-project-type"
            value={form.projectType}
            onChange={(e) => setForm({ ...form, projectType: e.target.value })}
            className={inputClass}
          >
            {PROJECT_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[#F4F1EA]">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-property-type">
            Property Type
          </label>
          <select
            id="enq-property-type"
            value={form.propertyType}
            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
            className={inputClass}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type} className="bg-[#F4F1EA]">
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-area">
            Approximate Area
          </label>
          <input
            id="enq-area"
            type="text"
            value={form.approximateArea}
            onChange={(e) => setForm({ ...form, approximateArea: e.target.value })}
            placeholder="e.g. 4,500 sq ft / 420 sqm"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-location">
            Location
          </label>
          <input
            id="enq-location"
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="New York / London / Zurich"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-budget">
            Estimated Budget
          </label>
          <select
            id="enq-budget"
            value={form.estimatedBudget}
            onChange={(e) => setForm({ ...form, estimatedBudget: e.target.value })}
            className={inputClass}
          >
            {BUDGET_RANGES.map((range) => (
              <option key={range} value={range} className="bg-[#F4F1EA]">
                {range}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="enq-timeline">
            Project Timeline
          </label>
          <select
            id="enq-timeline"
            value={form.projectTimeline}
            onChange={(e) => setForm({ ...form, projectTimeline: e.target.value })}
            className={inputClass}
          >
            {TIMELINES.map((tl) => (
              <option key={tl} value={tl} className="bg-[#F4F1EA]">
                {tl}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="enq-description">
          Project Description & Aspirations *
        </label>
        <textarea
          id="enq-description"
          rows={4}
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe your architectural vision, site condition, desired atmosphere, and key functional spaces..."
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="space-y-3">
        <span className={labelClass}>Reference Images or Inspiration Files (Up to 5 images / PDFs)</span>
        <label className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-dashed border-[#252521]/30 bg-[#FFFFFF]/60 px-6 py-5 hover:border-[#252521] transition-colors cursor-pointer">
          <div className="flex items-center gap-3 text-sm text-[#252521]/80">
            <Upload className="w-4 h-4 stroke-[1.5] shrink-0" />
            <span>Attach architectural plans, mood references, or site photography (max 4 MB each)</span>
          </div>
          <span className="text-xs tracking-[0.16em] uppercase border border-[#252521]/30 px-4 py-2 shrink-0">
            Browse Files
          </span>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => void handleFileChange(e.target.files)}
          />
        </label>

        {files.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="relative border border-[#252521]/15 bg-[#FFFFFF] p-2">
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.dataUrl}
                    alt={file.name}
                    className="w-full h-20 object-cover mb-2"
                  />
                ) : (
                  <div className="w-full h-20 bg-[#D9CCB8]/35 flex items-center justify-center text-xs uppercase tracking-widest mb-2">
                    PDF
                  </div>
                )}
                <p className="text-[11px] truncate text-[#252521]/80 pr-5">{file.name}</p>
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#252521] text-[#F4F1EA] flex items-center justify-center cursor-pointer"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-[#252521]/60">
          All architectural briefs and site files remain strictly confidential.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#252521] text-[#F4F1EA] text-xs tracking-[0.18em] uppercase hover:bg-[#3A3A34] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span>{submitting ? 'Sending Brief...' : 'Request Private Consultation'}</span>
          <ArrowRight className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    </form>
  );
}
