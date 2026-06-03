'use client';

import React from 'react';

export default function Textarea({ value, onChange, placeholder, rows = 4, label }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-muted">{label}</label>}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="resize-y rounded-md border border-border-strong bg-glass px-3.5 py-3 text-sm leading-6 text-text outline-none placeholder:text-subtle"
      />
    </div>
  );
}
