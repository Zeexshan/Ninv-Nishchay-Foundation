import { useState, useEffect } from "react";
import { Link } from "wouter";
import type { NNFEvent } from "../App";

/* ─── SECURITY NOTICE ──────────────────────────────────────────────────────
 * NOTE: This is a UI-only password gate for convenience.
 * It does NOT protect any backend data. All event data is stored in
 * localStorage only. For real security, use a proper backend with authentication.
 * ────────────────────────────────────────────────────────────────────────── */
const ADMIN_PASSWORD = "NNF@2025Admin";
const AUTH_KEY = "nnf_admin_auth";
const EVENTS_KEY = "nnf_events";

function sanitize(str: string): string {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadStoredEvents(): NNFEvent[] {
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // QuotaExceededError or SecurityError — fall through
  }
  return [];
}

function saveEvents(events: NNFEvent[]) {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    // Dispatch storage event so the main site reloads events
    window.dispatchEvent(new Event("storage"));
  } catch {
    alert("Could not save events. Storage may be full or restricted.");
  }
}

const EMPTY_FORM = {
  title: "",
  date: "",
  image: "",
  location: "",
  description: "",
  tags: "",
};

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => {
    try { return localStorage.getItem(AUTH_KEY) === "true"; } catch { return false; }
  });
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  const [events, setEvents] = useState<NNFEvent[]>(loadStoredEvents);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Re-sync when another tab changes localStorage
    const onStorage = () => setEvents(loadStoredEvents());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Auth gate ──────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="admin-gate">
        <div className="admin-gate-box">
          <div className="admin-gate-logo">🌱</div>
          <h1 className="admin-gate-title">Ninv Nishchay Foundation</h1>
          <p className="admin-gate-sub">Event Manager — Admin Access</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pwInput === ADMIN_PASSWORD) {
                try { localStorage.setItem(AUTH_KEY, "true"); } catch {}
                setAuthed(true);
              } else {
                setPwError(true);
                setPwInput("");
              }
            }}
          >
            <input
              className="admin-pw-input"
              type="password"
              placeholder="Enter admin password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              autoFocus
            />
            {pwError && <div className="admin-pw-error">Incorrect password. Please try again.</div>}
            <button className="admin-login-btn" type="submit">Login →</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────
  const handleLogout = () => {
    try { localStorage.removeItem(AUTH_KEY); } catch {}
    setAuthed(false);
  };

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setFormError("");
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.date || !form.location.trim() || !form.description.trim()) {
      setFormError("Title, Date, Location, and Description are required.");
      return;
    }
    if (form.image && !form.image.startsWith("https://")) {
      setFormError("Image URL must start with https://");
      return;
    }

    const tags = form.tags
      .split(",")
      .map((t) => sanitize(t.trim()))
      .filter(Boolean);

    if (editId !== null) {
      const updated = events.map((ev) =>
        ev.id === editId
          ? {
              ...ev,
              title: sanitize(form.title),
              date: form.date,
              image: form.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
              location: sanitize(form.location),
              description: sanitize(form.description),
              tags,
            }
          : ev
      );
      setEvents(updated);
      saveEvents(updated);
      setEditId(null);
    } else {
      const newId = events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
      const newEvent: NNFEvent = {
        id: newId,
        title: sanitize(form.title),
        date: form.date,
        image: form.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
        location: sanitize(form.location),
        description: sanitize(form.description),
        tags,
      };
      const updated = [...events, newEvent];
      setEvents(updated);
      saveEvents(updated);
    }
    setForm(EMPTY_FORM);
  };

  const handleEdit = (ev: NNFEvent) => {
    setEditId(ev.id);
    setForm({
      title: ev.title,
      date: ev.date,
      image: ev.image,
      location: ev.location,
      description: ev.description,
      tags: ev.tags.join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    const updated = events.filter((ev) => ev.id !== id);
    setEvents(updated);
    saveEvents(updated);
    if (editId === id) { setEditId(null); setForm(EMPTY_FORM); }
  };

  const handleReset = () => {
    if (!window.confirm("Reset all events to defaults? Admin edits will be lost.")) return;
    try { localStorage.removeItem(EVENTS_KEY); } catch {}
    setEvents([]);
    window.dispatchEvent(new Event("storage"));
  };

  const handleCopy = () => {
    const arr = JSON.stringify(events, null, 2);
    navigator.clipboard.writeText(`const EVENTS = ${arr};`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const getStatus = (date: string) => {
    const today = new Date(); today.setHours(0,0,0,0);
    return new Date(date) >= today ? "Upcoming" : "Past";
  };

  // ── UI ─────────────────────────────────────────────────────────────────
  return (
    <div className="admin-wrap">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-inner">
          <div>
            <div className="admin-header-title">🌱 Event Manager</div>
            <div className="admin-header-sub">Ninv Nishchay Foundation — Admin Panel</div>
          </div>
          <div className="admin-header-actions">
            <Link href="/" className="admin-back-btn">← View Site</Link>
            <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <div className="admin-body">
        {/* Notice */}
        <div className="admin-notice">
          💡 Changes are saved in <strong>your browser</strong>. To make them permanent, click <strong>"Copy Events Array"</strong> and send it to your developer.
        </div>

        {/* Add / Edit Form */}
        <div className="admin-card">
          <h2 className="admin-section-title">
            {editId !== null ? "✏️ Edit Event" : "➕ Add New Event"}
          </h2>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label>Event Title *</label>
              <input
                type="text"
                value={form.title}
                placeholder="e.g. Blood Donation Camp"
                onChange={(e) => handleFormChange("title", e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleFormChange("date", e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label>Location *</label>
              <input
                type="text"
                value={form.location}
                placeholder="e.g. Civil Hospital, Ujjain"
                onChange={(e) => handleFormChange("location", e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                placeholder="e.g. Health, Community"
                onChange={(e) => handleFormChange("tags", e.target.value)}
              />
            </div>
            <div className="admin-form-group admin-form-full">
              <label>Image URL (must start with https://)</label>
              <input
                type="url"
                value={form.image}
                placeholder="https://images.unsplash.com/..."
                onChange={(e) => handleFormChange("image", e.target.value)}
              />
            </div>
            <div className="admin-form-group admin-form-full">
              <label>Description *</label>
              <textarea
                rows={3}
                value={form.description}
                placeholder="Short description shown on the event card..."
                onChange={(e) => handleFormChange("description", e.target.value)}
              />
            </div>
          </div>
          {formError && <div className="admin-form-error">{formError}</div>}
          <div className="admin-form-actions">
            <button className="admin-save-btn" onClick={handleSave}>
              {editId !== null ? "Save Changes" : "Add Event"}
            </button>
            {editId !== null && (
              <button className="admin-cancel-btn" onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Events list */}
        <div className="admin-card">
          <div className="admin-list-header">
            <h2 className="admin-section-title">📋 All Events ({events.length})</h2>
            <div className="admin-list-actions">
              <button className="admin-copy-btn" onClick={handleCopy}>
                {copied ? "✓ Copied!" : "Copy Events Array"}
              </button>
              <button className="admin-reset-btn" onClick={handleReset}>Reset to Defaults</button>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="admin-empty">
              No events saved in browser. The site is currently showing the default hardcoded events.<br />
              Add events above to override them, or click <strong>Reset to Defaults</strong> to clear overrides.
            </div>
          ) : (
            <div className="admin-events-list">
              {[...events]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((ev) => (
                  <div className="admin-event-row" key={ev.id}>
                    <img
                      className="admin-event-thumb"
                      src={ev.image}
                      alt={ev.title}
                      onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                    />
                    <div className="admin-event-info">
                      <div className="admin-event-title">{ev.title}</div>
                      <div className="admin-event-meta">
                        <span className={`admin-status-pill admin-status-${getStatus(ev.date).toLowerCase()}`}>
                          {getStatus(ev.date)}
                        </span>
                        <span>📅 {ev.date}</span>
                        <span>📍 {ev.location}</span>
                        {ev.tags.length > 0 && <span>🏷 {ev.tags.join(", ")}</span>}
                      </div>
                      <div className="admin-event-desc">{ev.description}</div>
                    </div>
                    <div className="admin-event-btns">
                      <button className="admin-edit-btn" onClick={() => handleEdit(ev)}>Edit</button>
                      <button className="admin-delete-btn" onClick={() => handleDelete(ev.id)}>Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
