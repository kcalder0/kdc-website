"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
};

export default function RefreshModal({ open, onClose, onSubmit }: Props) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Reset state and focus the input each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError(null);
    setSubmitting(false);
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open]);

  // Dismiss on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, submitting, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !password) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Refresh failed";
      setError(message || "Incorrect password");
      setPassword("");
      setSubmitting(false);
      inputRef.current?.focus();
      return;
    }
    setSubmitting(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (submitting) return;
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ust-refresh-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-xl"
      >
        <h2
          id="ust-refresh-title"
          className="text-base font-semibold text-primary"
        >
          Refresh data
        </h2>
        <p className="mt-1 text-xs text-muted">
          Manual refreshes are password protected. Auto-refreshes from the
          backend continue regardless.
        </p>

        <label className="mt-5 block text-xs font-medium text-primary-soft">
          Password
        </label>
        <input
          ref={inputRef}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          disabled={submitting}
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
        />

        {error && (
          <p
            role="alert"
            className="mt-2 text-xs text-rose-600"
          >
            {error}
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-primary disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !password}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <svg
                className="h-3.5 w-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.25"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            <span>{submitting ? "Refreshing…" : "Confirm"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
