'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const serviceOptions = [
  'Hardware Repair',
  'Software Repair',
  'Virus & Security',
  'Data Services',
  'Networking',
  'Business IT Support',
  'Setup & Installation',
  'Upgrade Services',
  'On-Site Support',
  'Other',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', service: '', message: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.issues) setFieldErrors(data.issues);
        throw new Error(data.error ?? 'Something went wrong.');
      }

      setStatus('success');
      setForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'success') {
    return (
      <div className="animate-fade-up flex flex-col items-center justify-center rounded-2xl border border-teal-100 bg-teal-50 px-8 py-16 text-center shadow-glow-teal">
        <CheckCircle2 className="h-14 w-14 text-teal drop-shadow-[0_0_12px_rgba(77,145,144,0.5)]" />
        <h3 className="mt-4 text-xl font-bold text-charcoal">Message Sent!</h3>
        <p className="mt-2 max-w-sm text-gray-500">
          We've received your enquiry and will get back to you within 24 hours.
          Check your inbox for a confirmation email.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-ghost mt-6"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  function fieldError(key: string) {
    const errs = fieldErrors[key];
    if (!errs?.length) return null;
    return <p className="mt-1 text-xs text-red-600">{errs[0]}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal">
            Full Name <span className="text-coral">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Mwangi"
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-all duration-300 focus:border-coral focus:ring-2 focus:ring-coral-200 focus:shadow-glow-coral"
          />
          {fieldError('name')}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email Address <span className="text-coral">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="jane@company.co.ke"
            className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-all duration-300 focus:border-coral focus:ring-2 focus:ring-coral-200 focus:shadow-glow-coral"
          />
          {fieldError('email')}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-charcoal">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+254 700 000 000"
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-all duration-300 focus:border-coral focus:ring-2 focus:ring-coral-200 focus:shadow-glow-coral"
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-charcoal">
          Organization / Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          value={form.company}
          onChange={handleChange}
          placeholder="Your company or school"
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-all duration-300 focus:border-coral focus:ring-2 focus:ring-coral-200 focus:shadow-glow-coral"
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium text-charcoal">
          Service Required <span className="text-coral">*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          value={form.service}
          onChange={handleChange}
          className="mt-1.5 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal outline-none transition-all duration-300 focus:border-coral focus:ring-2 focus:ring-coral-200 focus:shadow-glow-coral"
        >
          <option value="">Select a service…</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {fieldError('service')}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-charcoal">
          Message <span className="text-coral">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Describe your technology needs or the issue you're experiencing…"
          className="mt-1.5 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-charcoal placeholder-gray-400 outline-none transition-all duration-300 focus:border-coral focus:ring-2 focus:ring-coral-200 focus:shadow-glow-coral"
        />
        {fieldError('message')}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full py-3.5 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        By submitting, you agree to our Privacy Policy. We never share your data.
      </p>
    </form>
  );
}
