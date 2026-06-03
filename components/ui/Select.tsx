'use client';

import React from 'react';
import Icon from '../Icon';

type Option = string | { value: string; label: string };

export default function Select({ value, onChange, options, label, size = 'md', disabled }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: Option[]; label?: string; size?: 'sm' | 'md' | 'lg'; disabled?: boolean }) {
  const height = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-11' : 'h-[38px]';
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-muted">{label}</label>}
      <div className={`flex items-center gap-2 rounded-md border border-border-strong bg-glass px-3 ${height} ${disabled ? 'opacity-70' : ''}`}>
        <select value={value} onChange={onChange} disabled={disabled} className="h-full min-w-0 flex-1 appearance-none bg-transparent text-sm text-text outline-none disabled:cursor-not-allowed">
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            return <option key={optionValue} value={optionValue} className="bg-surface text-text">{optionLabel}</option>;
          })}
        </select>
        <Icon name="chevdown" size={14} className="text-subtle" />
      </div>
    </div>
  );
}
