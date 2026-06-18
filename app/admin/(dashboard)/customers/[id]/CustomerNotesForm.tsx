'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';

type Customer = { id: string; notes: string; tags: string[] };

export default function CustomerNotesForm({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [notes, setNotes] = useState(customer.notes);
  const [tags, setTags] = useState(customer.tags);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !tagInput.trim()) return;
    e.preventDefault();
    if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    await fetch(`/api/admin/customers/${customer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes, tags }),
    });
    setLoading(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="card space-y-4">
      <h2 className="font-bold text-charcoal">Notes &amp; Tags</h2>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs text-teal">
              {tag}
              <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="Type a tag and press Enter (e.g. VIP, recurring)"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">Internal Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Notes visible only to staff…"
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-coral focus:ring-2 focus:ring-coral-200"
        />
      </div>

      <button onClick={handleSave} disabled={loading} className="btn-ghost text-sm disabled:opacity-60">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : saved ? 'Saved ✓' : 'Save'}
      </button>
    </div>
  );
}
